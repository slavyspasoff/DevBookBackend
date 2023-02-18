import { join } from 'path'
import { rm } from 'fs/promises'
import { env } from 'process'

import { type UserDocument } from '../types/user.type.js'
import { __dirname } from '../app.js'

const { NODE_ENV } = env as Env

const deleteReplacedPicture = (
  user: UserDocument,
  target: 'userBanner' | 'userPic'
) =>
  user[target]
    ? rm(join(__dirname, '..', user[target] as string)).catch(
        (err) => NODE_ENV === 'development' && console.log(err)
      )
    : undefined

export { deleteReplacedPicture }
