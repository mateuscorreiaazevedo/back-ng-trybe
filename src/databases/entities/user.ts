import mongoose, { Document, model, PaginateModel, Schema } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import paginateAggregate from 'mongoose-aggregate-paginate-v2'
import { IAccount } from './account'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  accountId?: IAccount
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    private: true
  },
  accountId: {
    type: Schema.Types.ObjectId
  }
}, {
  timestamps: true
})

UserSchema.plugin(paginateAggregate)


interface AggregatePaginateModel<T, TQueryHelpers = {}, TMethods = {}> extends mongoose.Model<T, TQueryHelpers, TMethods> {
  aggregatePaginate<O extends mongoose.PaginateOptions>(
    query?: mongoose.FilterQuery<T>,
    options?: O,
    callback?: (
      err: any,
      result: mongoose.PaginateResult<mongoose.PaginateDocument<T, TMethods, O>>
    ) => void
  ): Promise<mongoose.PaginateResult<mongoose.PaginateDocument<T, TMethods, O>>>;
}

export default model<IUser, AggregatePaginateModel<IUser>>('users', UserSchema)
