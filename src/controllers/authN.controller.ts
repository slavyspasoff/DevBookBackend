import { env } from 'process'

import { type Request, type Response, type NextFunction } from 'express'

import User, { type UserDocument } from '../models/user.model.js'
import { signToken, verifyFileUpload, type Files } from './authN.helpers.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'

const { NODE_ENV } = env as Env

interface RegisterReqBody {
  username?: string
  email?: string
  password?: string
  confirm?: string
}
interface ResBody {
  status: 'success'
  data: UserDocument
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

    res
      .status(201)
      .cookie('access_token', token, {
        httpOnly: true,
        secure: NODE_ENV === 'production' ? true : false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json({
        status: 'success',
        data,
        token,
      })
  }
)

interface LoginReqBody {
  email?: string
  password?: string
}

const login = catchAsync(
  async (
    req: Request<Record<string, string>, ResBody, LoginReqBody>,
    res: Response<ResBody>,
    next: NextFunction
  ) => {
    const { email, password } = req.body
    const { friends, posts } = req.query

    if (!email || !password) {
      return next(new AppError('Invalid email or password.', 401))
    }

    const query = User.findOne({ email }).select('+password')

    if (friends === 'true') {
      query.populate({
        path: 'friends',
        select: 'username userPic nickname',
      })
    }
    if (posts === 'true') {
      query.populate({
        path: 'posts',
        select: 'username desc userPic likes comments -userId',
      })
    }

    const data = await query.orFail(
      new AppError('Invalid email or password.', 401)
    )
    const isPasswordCorrect = await data.verifyPassword(password)
    if (!isPasswordCorrect) {
      return next(new AppError('Invalid email or password.', 401))
    }

    data.password = undefined as unknown as string

    const token = signToken(data._id.toString())

    res.status(200).json({
      status: 'success',
      data,
      token,
    })
  }
)

export { register, login }
