import { env } from 'process'

import {
  type Request,
  type Response,
  type NextFunction,
  type CookieOptions,
} from 'express'

import User, { type UserDocument } from '../models/user.model.js'
import { signToken, verifyFileUpload, type Files } from './authN.helpers.js'
import { attachQueries } from './user.helpers.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'

const { NODE_ENV } = env as Env

type RegisterReqBody = Partial<
  Pick<UserDocument, 'username' | 'email' | 'password' | 'confirm'>
>

interface ResBody {
  status: 'success'
  data: Omit<UserDocument, 'password'>
  token: string
}

const register = catchAsync(
  async (
    req: Request<Record<string, string>, ResBody, RegisterReqBody>,
    res: Response<ResBody>
  ) => {
    const { username, email, password, confirm } = req.body
    const { userBanner, userPic } = verifyFileUpload(req.files as Files)

    const data = await User.create({
      username,
      email,
      password,
      confirm,
      userPic,
      userBanner,
    })

    data.password = undefined as unknown as string

    const token = signToken(data._id.toString())

    res.status(201).cookie('access_token', token, cookieOptions).json({
      status: 'success',
      data,
      token,
    })
  }
)

type LoginReqBody = Partial<Pick<UserDocument, 'email' | 'password'>>

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === 'production' ? true : false,
  maxAge: 30 * 24 * 60 * 60 * 1000,
}

const login = catchAsync(
  async (
    req: Request<Record<string, string>, ResBody, LoginReqBody>,
    res: Response<ResBody>,
    next: NextFunction
  ) => {
    const { email, password } = req.body

    if (!email || !password) {
      return next(new AppError('Invalid email or password.', 401))
    }
    const query = User.findOne({ email }).select('+password')

    const data = await attachQueries(query, req.query).orFail(
      new AppError('Invalid email or password.', 401)
    )

    const isPasswordCorrect = await data.verifyPassword(password)
    if (!isPasswordCorrect) {
      return next(new AppError('Invalid email or password.', 401))
    }

    data.password = undefined as unknown as string

    const token = signToken(data._id.toString())

    res.status(200).cookie('access_token', token, cookieOptions).json({
      status: 'success',
      data,
      token,
    })
  }
)

const logout = (req: Request, res: Response) => {
  res
    .status(204)
    .clearCookie('access_token', {
      httpOnly: true,
      secure: NODE_ENV === 'production' ? true : false,
    })
    .json({
      status: 'success',
      data: null,
    })
}

const verifyLogin = catchAsync(
  async (
    req: Request<
      Record<string, string>,
      Omit<ResBody, 'token'>,
      Record<string, never>
    >,
    res: Response<Omit<ResBody, 'token'>>
  ) => {
    const { _id: id } = req.user as UserDocument
    const data = await User.findById(id)
      .populate('friends')
      .populate('posts')
      .orFail(new AppError('Please log in.', 401))

    res.status(200).json({
      status: 'success',
      data,
    })
  }
)

export { register, login, logout, verifyLogin }
