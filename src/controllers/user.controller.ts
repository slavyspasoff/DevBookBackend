import { type Request, type Response } from 'express'

import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'

import User, { type UserDocument } from '../models/user.model.js'

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

export { getAllUsers }
