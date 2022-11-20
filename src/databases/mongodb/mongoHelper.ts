import mongoose from 'mongoose'

mongoose.set('toJSON', {
  virtuals: true,
  transform: (_, converted) => {
    delete converted._id
    delete converted.__v
  }
})

class MongoHelper {
  private client: null | typeof mongoose | void
  private url: null | string

  async connect (
    user: string,
    pass: string,
    database: string = 'usersRetry'
  ): Promise<void> {
    const url = `mongodb+srv://${user}:${pass}@cluster0.ylpe9.mongodb.net/${database}?retryWrites=true&w=majority`

    this.url = url
    this.client = await mongoose.connect(url)
  }

  async disconnect () {
    if (this.client == null) throw new Error('Banco não conectado ao cliente')

    this.url = null
    this.client = await this.client.disconnect()
  }
}

export const mongoHelper = new MongoHelper()
