import { type Model, type Types } from 'mongoose'

interface Post {
  user: Types.ObjectId
  desc: string
  title: string
  picturePath?: string
  likes: Types.ObjectId[]
  comments: string[]
}

interface PostDocument extends Post {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

interface PostMethods {}

type PostModel = Model<PostDocument, Record<string, never>, PostMethods>

export { type PostDocument, type PostModel, type PostMethods }
