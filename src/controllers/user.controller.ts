import { type Request, type Response } from 'express'

import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import { verifyFileUpload, type Files } from './authN.helpers.js'
import User, { type UserDocument } from '../models/user.model.js'
import { deleteReplacedPicture, attachQueries } from './user.helpers.js'
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
    const data = await attachQueries(User.find({}), req.query)

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
    const { id } = req.params

    const data = await attachQueries(User.findById(id), req.query).orFail(
      new AppError('User not found.', 404)
    )

    res.status(200).json({
      status: 'success',
      data,
    })
  }
)

const updateSelf = catchAsync(async (req, res, next) => {
  const { _id: id } = req.user as UserDocument

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

  if (userBanner) {
    await deleteReplacedPicture(req.user as UserDocument, 'userBanner')
  }
  if (userPic) {
    await deleteReplacedPicture(req.user as UserDocument, 'userPic')
  }

  res.status(200).json({
    status: 'success',
    data,
  })
})

const addRemoveFriend = catchAsync(async (req, res, next) => {
  const { id: friendID } = req.params
  const { _id: userID } = req.user as UserDocument
  let { friends } = req.user as UserDocument

  const foundFriend = await User.findById(friendID).orFail(
    new AppError('Friend not found.', 404)
  )
  const isFriend = friends.find((e) => e._id.toString() === friendID)

  isFriend
    ? (friends = friends.filter((e) => e._id.toString() !== friendID))
    : friends.push(foundFriend._id)

  const data = await User.findByIdAndUpdate(
    userID,
    { friends },
    { new: true, runValidators: true }
  )
    .populate({ path: 'friends', select: 'username userPic nickname' })
    .orFail(new AppError('User was deleted', 404))

  res.status(200).json({
    status: 'success',
    data,
  })
})

export { getAllUsers, getUser, updateSelf, addRemoveFriend }
