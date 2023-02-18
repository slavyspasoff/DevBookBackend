import { Router } from 'express'
import passport from 'passport'

import { createPost } from '../controllers/post.controller.js'
import { postUploads } from '../middleware/multerUploads.middleware.js'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

router.post('/', postUploads, createPost)

export { router as default }
