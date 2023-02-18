import { Schema, model } from 'mongoose'
import {
  type PostDocument,
  type PostModel,
  type PostMethods,
} from '../types/post.type.js'

const postSchema = new Schema<PostDocument, PostModel, PostMethods>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    desc: {
      type: String,
      maxlength: [
        100,
        '{PATH} name must be between 100 or less characters long.',
      ],
      required: true,
    },
    title: {
      type: String,
      maxlength: [
        50,
        '{PATH} name must be between 50 or less characters long.',
      ],
      required: true,
    },
    image: {
      type: String,
    },
    likes: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [],
    },
    comments: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

postSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'username userPic nickname' })
  next()
})

const Post = model<PostDocument, PostModel>('Post', postSchema)

export { Post as default }
export {
  type PostDocument,
  type PostModel,
  type PostMethods,
} from '../types/post.type.js'
