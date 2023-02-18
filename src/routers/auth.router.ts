import { Router } from 'express'

import { register, login, logout } from '../controllers/authN.controller.js'
import multerUploads from '../middleware/multerUploads.middleware.js'

const router = Router()

router.post('/register', multerUploads, register)
router.post('/login', login)
router.post('/logout', logout)

export { router as default }
