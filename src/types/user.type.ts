import { type Model, type Types } from 'mongoose'

interface User {
  username: string
  email: string
  password: string
  confirm?: string
  userPic?: string
  userBanner?: string
  nickname?: string
  quote?: string
  friends: Types.ObjectId[]
}

interface UserDocument extends User {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

interface UserMethods {}

type UserModel = Model<UserDocument, Record<string, never>, UserMethods>

export { type UserDocument, type UserModel, type UserMethods }
