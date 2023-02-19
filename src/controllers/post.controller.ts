import { type Request, type Response } from 'express'

import Post, { type PostDocument } from '../models/post.model.js'
import { type UserDocument } from '../types/user.type.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import { getPagination } from './post.helper.js'

type CreateReqBody = Partial<Pick<PostDocument, 'desc' | 'title' | 'image'>>

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
    res: Response<GetAllResBody>
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

const getPost = catchAsync(
  async (
    req: Request<Record<string, string>, ResBody, Record<PropertyKey, never>>,
    res: Response<ResBody>
  ) => {
    const { id } = req.params
    const data = await Post.findById(id).orFail(
      new AppError('Post not found.', 404)
    )

    res.status(200).json({
      status: 'success',
      data,
    })
  }
)

const deletePost = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { _id: userID } = req.user as UserDocument

  const data = await Post.findById(id).orFail(
    new AppError('Post not found.', 404)
  )

  if (data.user._id.toString() !== userID.toString()) {
    return next(
      new AppError('Post does not belong to the logged in user.', 401)
    )
  }
  await data.delete()

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

export { createPost, getAllPosts, getPost, deletePost }
