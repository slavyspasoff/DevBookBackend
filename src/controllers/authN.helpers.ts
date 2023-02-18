import { env } from 'process'

import jwt, { type SignOptions } from 'jsonwebtoken'
const { JWT_SECRET, JWT_EXPIRES } = env as Env

const signToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES,
  }

  return jwt.sign({ id }, JWT_SECRET, options)
}

type Files =
  | {
      [K: string]: Express.Multer.File[]
    }
  | undefined

const verifyFileUpload = (files: Files) => {
  if (!files) {
    return { userBanner: undefined, userPic: undefined }
  }
  let userBanner = undefined
  let userPic = undefined
  if (files.userBanner) {
    userBanner = files.userBanner[0].destination.concat(
      files.userBanner[0].originalname
    )
  }
  if (files.userPic) {
    userPic = files.userPic[0].destination.concat(files.userPic[0].originalname)
  }
  return { userBanner, userPic }
}

export { signToken, verifyFileUpload, type Files }
