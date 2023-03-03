import { Schema, model } from 'mongoose'
import {
  type CommentDocument,
  type CommentModel,
  type CommentMethods,
} from '../types/comment.type.js'

const commentSchema = new Schema<CommentDocument, CommentModel, CommentMethods>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    text: {
      type: String,
      minlength: [1, '{PATH} must be between 1 or less characters long.'],
      maxlength: [300, '{PATH} must be between 300 or less characters long.'],
      required: true,
    },
  },
  { timestamps: true }
)

commentSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'username userPic' })
  next()
})

const Comment = model<CommentDocument, CommentModel>('Comment', commentSchema)

export { Comment as default }
export {
  type CommentDocument,
  type CommentModel,
  type CommentMethods,
} from '../types/comment.type.js'
