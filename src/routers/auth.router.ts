import { Router } from 'express'

import { register, login } from '../controllers/authN.controller.js'
import multerUploads from '../middleware/multerUploads.middleware.js'

const router = Router()

router.post('/register', multerUploads, register)
router.post('/login', login)

export { router as default }
