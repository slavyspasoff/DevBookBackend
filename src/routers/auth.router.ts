import { Router } from 'express'

import { register } from '../controllers/authN.controller.js'
import multerUploads from '../middleware/multerUploads.middleware.js'

const router = Router()

router.post('/register', multerUploads, register)

export { router as default }
