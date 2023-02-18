import { env } from 'process'

import {
  Strategy,
  type VerifyCallback,
  type StrategyOptions,
} from 'passport-jwt'
import passport from 'passport'

import User, { type UserDocument } from '../models/user.model.js'

const { JWT_SECRET } = env as Env

const options: StrategyOptions = {
  jwtFromRequest: (req) =>
    (req.cookies as { access_token: string }).access_token,
  secretOrKey: JWT_SECRET,
}
interface Payload {
  id: string
}

const verify: VerifyCallback = (payload: Payload, done) => {
  const { id } = payload
  User.findById(id)
    .then((user) => done(null, user as UserDocument))
    .catch((err) => done(err))
}

const strategy = new Strategy(options, verify)

export default (p: passport.PassportStatic) => p.use('jwt', strategy)
