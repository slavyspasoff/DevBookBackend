import { Router } from 'express'

import { register, login, logout } from '../controllers/authN.controller.js'
import { profileUploads } from '../middleware/multerUploads.middleware.js'

const router = Router()

router.post('/register', profileUploads, register)
router.post('/login', login)
router.post('/logout', logout)

export { router as default }
