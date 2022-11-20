import mongoose from 'mongoose'
import { Request, Response } from "express";
import { apiErrorsHelper, loadToken } from "../helpers";
import { Transaction } from '../../databases/entities';
import { userController } from './userController';
import { accountController } from './accountController';

class TransactionController {
  async index  (req: Request, res: Response) {
    const { date = '', type = '' } = req.query

    if (type && !['in', 'out'].includes(type as string)) {
      res.status(422).json({ errors: ['Tipo de transação inválida.']})
      return
    }

    if (date) {
      const regex = /^\d{4}-\d{2}-\d{2}$/
      if (
        !(date as string).match(regex) ||
        ((new Date(`${date} 00:00:00`)).toString() === 'Invalid Date') ||
        ((new Date(`${date} 00:00:00`)).toISOString().slice(0, 10) !== date)
      ) {
        res.status(422).json({ errors: ['Data inválida.' ]})
        return
      }
    }

    const id = await loadToken(req)

    const transactions = await Transaction.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'debitedAccountId',
          foreignField: 'accountId',
          as: 'debited'
        }
      },
      {
        $unwind: '$debited'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'creditedAccountId',
          foreignField: 'accountId',
          as: 'credited'
        }
      },
      {
        $unwind: '$credited'
      },
      {
        $replaceWith: {
          id: '$_id',
          createdAt: '$createdAt',
          value: '$value',
          debited: {
            id: '$debited._id',
            name: '$debited.name',
            email: '$debited.email',
          },
          credited: {
            id: '$credited._id',
            name: '$credited.name',
            email: '$credited.email',
          }
        }
      },
      {
        $project: {
          id: 1,
          createdAt: 1,
          debited: 1,
          credited: 1,
          value: 1,
          transferred: {
            $eq: ['$debited.id', new mongoose.Types.ObjectId(id)]
          }
        }
      },
      {
        $match: {
          ...(date && {
            createdAt: {
              $gte: new Date(`${date}T00:00:00.000Z`),
              $lte: new Date(`${date}T23:59:59.000Z`)
            }
          }),
          $or: [
            {
              "debited.id": new mongoose.Types.ObjectId(id)
            },
            {
              "credited.id": new mongoose.Types.ObjectId(id)
            }
          ],
          ...(type && {
            transferred: type === 'out'
          }),
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ])

    res.status(200).json(transactions)
  }

  async transfer (req: Request, res: Response) {
    const { to, value } = req.body

    try {
      const id = await loadToken(req)

      const isValidToken = mongoose.Types.ObjectId.isValid(to)

      if (!isValidToken) {
        res.status(422).json({ errors: ['Id do usuário não é válido.' ]})
        return
      }

      if (id === to) {
        res.status(422).json({ errors: ['O Usuário não pode fazer uma transferência para si mesmo']})
        return
      }

      const [me] = await userController.getUser(id)
      const [userToTransfer] = await userController.getUser(to)

      if (!userToTransfer) {
        res.status(404).json({ errors: ['Usuário de destino não encontrado.'] })
        return
      }
      
      if (value > me.account.balance) {
        res.status(404).json({errors: ['Valor não disponível em carteira.']})
        return
      }
      
      await accountController.update(me.account.id, (me.account.balance - value))
      await accountController.update(userToTransfer.account.id, (userToTransfer.account.balance + value))

      await Transaction.create({
        debitedAccountId: me.account.id,
        creditedAccountId: userToTransfer.account.id,
        value
      })

      res.status(201).json({ message: "Transferência realizada com sucesso"})
    } catch (error) {
      apiErrorsHelper(res, error)
    }

  }
}

export const transactionController = new TransactionController()
