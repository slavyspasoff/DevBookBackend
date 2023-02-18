import { env } from 'process'
// import { type Types } from 'mongoose'
import jwt, { type SignOptions } from 'jsonwebtoken'

const { JWT_SECRET, JWT_EXPIRES } = env as Env

const signToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES,
  }

  return jwt.sign({ id }, JWT_SECRET, options)
}

export { signToken }
