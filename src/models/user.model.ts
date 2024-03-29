import { Schema, model } from 'mongoose'
import { hash, compare } from 'bcrypt'
import {
  type UserDocument,
  type UserModel,
  type UserMethods,
} from '../types/user.type.js'

const UserSchema = new Schema<UserDocument, UserModel, UserMethods>(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'User must have a {PATH}'],
      minlength: [3, '{PATH} must be between 3 or more characters long.'],
      maxlength: [30, '{PATH} must be between 30 or less characters long.'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'User must have an {PATH}.'],
      maxlength: [100, '{PATH} must be between 100 or less characters long.'],
      validate: {
        validator: function (v: UserDocument['email']) {
          return v.includes('@') && v.includes('.')
        },
        message: 'Please provide a valid {PATH}.',
      },
    },
    password: {
      type: String,
      select: false,
      required: [true, 'please provide a valid {PATH}'],
      minlength: [5, '{PATH} must be between 8 and 50 characters long.'],
      maxlength: [50, '{PATH} must be between 8 and 50 characters long.'],
    },
    confirm: {
      type: String,
      required: [true, 'Please provide a confirmation password'],
      validate: {
        validator: function (this: UserDocument, confirm: string) {
          return confirm === this.password
        },
        message: "Passwords don't match!",
      },
    },
    userPic: {
      type: String,
      default: '',
    },
    userBanner: {
      type: String,
      default: '',
    },
    nickname: {
      type: String,
      default: '',
    },
    quote: {
      type: String,
      default: '',
    },
    friends: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await hash(this.password, 12)
  this.confirm = undefined
  next()
})

UserSchema.methods.verifyPassword = async function (
  this: UserDocument,
  candidate: string
) {
  return compare(candidate, this.password)
}

UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'user',
})

const User = model<UserDocument, UserModel>('User', UserSchema)

export { User as default }
export {
  type UserDocument,
  type UserModel,
  type UserMethods,
} from '../types/user.type.js'
