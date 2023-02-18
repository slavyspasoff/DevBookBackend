import { Router } from 'express'
import passport from 'passport'

import { getAllUsers } from '../controllers/user.controller.js'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

router.route('/').get(getAllUsers)

export { router as default }
