import { Router } from 'express'

import passport from 'passport'

import {
  register,
  login,
  logout,
  verifyLogin,
} from '../controllers/authN.controller.js'
import { profileUploads } from '../middleware/multerUploads.middleware.js'

const router = Router()

router.post('/register', profileUploads, register)
router.post('/login', login)
router.post('/logout', logout)

router.use(passport.authenticate('jwt', { session: false }))
router.get('/verifyLogin', verifyLogin)

export { router as default }
