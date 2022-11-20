import { Account } from '../../databases/entities'

class AccountController {
  async store (balance: number): Promise<string> {
    try {
      const account = await Account.create({
        balance
      })

      return String(account.id)

    } catch (error) {
      return error as any
    }
  }

  async update (id: string, balance: number): Promise<boolean> {
    const account = await Account.updateOne({
      _id: id
    }, {
      balance
    })

    return !!account
  }

  async destroy (id: string): Promise<boolean> {
    try {
      const destroy = await Account.deleteOne({
        _id: id
      })

      return !!destroy
    } catch (error) {
      return error as any
    }
  }
}

export const accountController = new AccountController()