import { type Request, type Response } from 'express'

import Post, { type PostDocument } from '../models/post.model.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import { type UserDocument } from '../types/user.type.js'
import { getPagination } from './post.helper.js'

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

interface GetAllResBody {
  status: 'success'
  data: PostDocument[]
  results: number
}

const getAllPosts = catchAsync(
  async (
    req: Request<
      Record<string, string>,
      GetAllResBody,
      Record<PropertyKey, never>
    >,
    res: Response<GetAllResBody>,
    next
  ) => {
    const query = Post.find({})

    const { skip, limit } = getPagination(req.query)
    query.skip(skip).limit(limit)

    const data = await query.sort({
      createdAt: -1,
    })

    res.status(200).json({
      status: 'success',
      results: data.length,
      data,
    })
  }
)

export { createPost, getAllPosts }
