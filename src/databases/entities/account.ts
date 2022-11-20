import { Document, model, Schema } from 'mongoose'

export interface IAccount extends Document {
  balance: number
}

const AccountSchema = new Schema({
  balance: {
    type: Number,
    required: true
  }
})

export default model<IAccount>('accounts', AccountSchema)
