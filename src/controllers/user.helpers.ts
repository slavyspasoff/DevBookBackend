import { join } from 'path'
import { rm } from 'fs/promises'
import { env } from 'process'

import { type QueryWithHelpers } from 'mongoose'

import { type UserDocument } from '../models/user.model.js'
import { __dirname as rootDir } from '../app.js'

const { NODE_ENV } = env as Env

const deleteReplacedPicture = (
  user: UserDocument,
  target: 'userBanner' | 'userPic'
) =>
  user[target]
    ? rm(join(rootDir, '..', user[target] as string)).catch(
        (err) => NODE_ENV === 'development' && console.log(err)
      )
    : undefined

interface ReqQueryFilters {
  friends?: 'true'
  posts?: 'true'
}

const attachQueries = <T extends QueryWithHelpers<unknown, unknown>>(
  query: T,
  reqQueryFilters: ReqQueryFilters
) => {
  const { posts, friends } = reqQueryFilters
  if (posts) {
    query.populate({
      path: 'posts',
    })
  }
  if (friends) {
    query.populate({
      path: 'friends',
      select: 'username userPic nickname',
    })
  }
  return query
}

export { deleteReplacedPicture, attachQueries }
