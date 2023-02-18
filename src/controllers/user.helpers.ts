import { join } from 'path'
import { rm } from 'fs/promises'

import { type UserDocument } from '../types/user.type.js'
import { __dirname } from '../app.js'

const deleteReplacedPicture = (
  user: UserDocument,
  target: 'userBanner' | 'userPic'
) => {
  console.log(join(__dirname, user[target] as string))
  return user[target]
    ? rm(join(__dirname, '..', user[target] as string)).catch((err) =>
        console.log(err)
      )
    : Promise.resolve(undefined)
}

export { deleteReplacedPicture }
