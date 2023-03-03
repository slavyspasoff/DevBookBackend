import { Types, Model } from 'mongoose'

interface Comment {
  text: string
  user: Types.ObjectId
  post: Types.ObjectId
}

interface CommentDocument extends Comment {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

interface CommentMethods {}

type CommentModel = Model<
  CommentDocument,
  Record<string, never>,
  CommentMethods
>

export { CommentDocument, CommentModel, CommentMethods }
