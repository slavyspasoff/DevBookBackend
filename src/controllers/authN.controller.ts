import { env } from 'process'

import { type Request, type Response } from 'express'

import User, { type UserDocument } from '../models/user.model.js'
import catchAsync from '../utils/catchAsync.js'
import { signToken, verifyFileUpload, type Files } from './authN.helpers.js'

const { NODE_ENV } = env as Env

interface RegisterReqBody {
  username: string
  email: string
  password: string
  confirm: string
}
interface ResBody {
  status: 'success'
  data?: Partial<UserDocument>
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

export { register }
