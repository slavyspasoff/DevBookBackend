import { type Request, type Response } from 'express'

import Post, { type PostDocument } from '../models/post.model.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import { type UserDocument } from '../types/user.type.js'

type CreateReqBody = Pick<PostDocument, 'desc' | 'title' | 'image'>

interface ResBody {
  status: 'success'
  data: PostDocument
}

const createPost = catchAsync(
  async (
    req: Request<Record<string, string>, ResBody, CreateReqBody>,
    res: Response<ResBody>
  ) => {
    const { desc, title } = req.body
    const { _id: user } = req.user as UserDocument

    const image = req.file ? req.file.path : undefined
    const data = await Post.create({
      user,
      desc,
      title,
      image,
    })

    res.status(201).json({
      status: 'success',
      data,
    })
  }
)

export { createPost }
