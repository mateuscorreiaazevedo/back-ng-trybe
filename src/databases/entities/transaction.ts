import { Document, model, Schema } from 'mongoose'
import { IAccount } from './account'

export interface ITransaction extends Document {
  debitedAccountId: IAccount
  creditedAccountId: IAccount
  value: number
}

const TransactionSchema = new Schema({
  debitedAccountId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  creditedAccountId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  value: {
    type: Number,
    private: true
  }
}, {
  timestamps: true
})

export default model<ITransaction>('transactions', TransactionSchema)
