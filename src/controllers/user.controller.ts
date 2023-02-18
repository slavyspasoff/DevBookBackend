import { type Request, type Response } from 'express'

import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import { verifyFileUpload, type Files } from './authN.helpers.js'
import User, { type UserDocument } from '../models/user.model.js'

interface ResBody {
  status: 'success'
  data: UserDocument
}

interface GetAllResBody {
  status: 'success'
  results: number
  data: UserDocument[]
}

const getAllUsers = catchAsync(
  async (
    req: Request<
      Record<string, string>,
      GetAllResBody,
      Record<PropertyKey, never>
    >,
    res: Response<GetAllResBody>
  ) => {
    const { friends, posts } = req.query

    const query = User.find({})

    if (friends === 'true') {
      query.populate({
        path: 'friends',
        select: 'username userPic nickname',
      })
    }
    if (posts === 'true') {
      query.populate({
        path: 'posts',
      })
    }

    const data = await query
    res.status(200).json({
      status: 'success',
      results: data.length,
      data,
    })
  }
)

const getUser = catchAsync(
  async (
    req: Request<Record<string, string>, ResBody, Record<PropertyKey, never>>,
    res: Response<ResBody>
  ) => {
    const { friends, posts } = req.query
    const { id } = req.params

    const query = User.findById(id).orFail(new AppError('User not found.', 404))

    if (friends === 'true') {
      query.populate({
        path: 'friends',
        select: 'username userPic nickname',
      })
    }
    if (posts === 'true') {
      query.populate({
        path: 'posts',
      })
    }

    const data = await query
    res.status(200).json({
      status: 'success',
      data,
    })
  }
)

const updateUser = catchAsync(async (req, res, next) => {
  await Promise.resolve('')
  const { id } = req.params
  const { _id: userID } = req.user as UserDocument

  if (userID.toString() !== id) {
    return next(new AppError('Users can edit only their own profile.', 401))
  }
  console.log(req.files)
  const { username, nickname, quote, email } = req.body
  const { userBanner, userPic } = verifyFileUpload(req.files as Files)

  const data = await User.findByIdAndUpdate(
    id,
    {
      username,
      nickname,
      quote,
      email,
      userBanner,
      userPic,
    },
    { new: true, runValidators: true }
  ).orFail(new AppError('User profile deleted.', 404))

  res.status(200).json({
    status: 'success',
    data,
  })
})

export { getAllUsers, getUser, updateUser }
