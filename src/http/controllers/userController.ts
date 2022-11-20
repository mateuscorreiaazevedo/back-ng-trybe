import { ObjectId } from 'mongodb'
import { Request, Response } from 'express'
import { User } from '../../databases/entities'
import { apiErrorsHelper, loadToken } from '../helpers'
import { accountController } from './accountController'
import { bcryptAdapter, jwtAdapter } from '../../adapters'

class UserController {
  async index (req: Request, res: Response) {
    const { page = '1', search = '' } = req.query

    try {
      const id = await loadToken(req)

      const query = [
        {
          $match: {
            _id: {
              $ne: new ObjectId(id)
            },
            ...(search && { $or: [
              {
                name: {
                  $regex: new RegExp(search as string, 'i')
                }
              },
              {
                email: {
                  $regex: new RegExp(search as string, 'i')
                }
              }
            ]})
          }
        },
        {
          $lookup: {
            from: 'accounts',
            localField: 'accountId',
            foreignField: '_id',
            as: 'account'
          }
        },
        {
          $unwind: '$account',
        },
        {
          $replaceWith: {
            id: '$_id',
            name: '$name',
            email: '$email',
            accountId: '$account._id'
          }
        }
      ]

      const currPage = page ? Number(page) : 1

      const usersModel = User.aggregate(query)
      const users = await User.aggregatePaginate(usersModel, { page: currPage })

      res.status(200).json(users)
    } catch (error) {
      apiErrorsHelper(res, error)
    }
  }
  
  async register (req: Request, res: Response) {
    const { name, email, password } = req.body

    const user = await User.findOne({ email })
    if (user) {
      res.status(422).json({errors: ['Endereço de email já cadastrado.']})
      return
    }

    const passHash = await bcryptAdapter.hash(password)

    let accountId: string|undefined

    try {
      accountId = await accountController.store(100)

      const users = await User.create({
        name,
        email,
        password: passHash,
        accountId
      })
      res.status(201).end()
    } catch (error) {
      if (accountId) {
        accountController.destroy(accountId)
      }
      apiErrorsHelper(res, error)
    }
  }

  async login (req: Request, res: Response) {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if(!user) {
      res.status(404).json({errors: ['Usuário não cadastrado.']})
      return
    }

    const passwordChecked = await bcryptAdapter.compare(password, user.password)

    if(!passwordChecked) {
      res.status(422).json({errors: ['Senha incorreta.']})
      return
    }

    res.status(201).json({
      token: jwtAdapter.encrypt(user.id)
    })
  }

  async getUser (id: string) {
    return User.aggregate([
      {
        $match: {
          _id: new ObjectId(id)
        }
      },
      {
        $lookup: {
          from: 'accounts',
          localField: 'accountId',
          foreignField: '_id',
          as: 'account'
        }
      },
      {
        $unwind: '$account',
      },
      {
        $replaceWith: {
          id: '$_id',
          name: '$name',
          email: '$email',
          account: {
            id: '$account._id',
            balance: '$account.balance',
          }
        }
      }
    ])
  }

  async getCurrentUser (req: Request, res: Response) {
    try {
      const id = await loadToken(req)

      const user = await userController.getUser(id)
      

      if (!user.length) {
        res.status(404).json({errors: ['Usuário não encontrado.']})
        return
      }

      res.status(200).json(user[0])

    } catch (error) {
      console.log(error)
      apiErrorsHelper(res, error)
    }
  }
}

export const userController = new UserController()