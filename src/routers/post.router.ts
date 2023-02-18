import { Router } from 'express'
import passport from 'passport'

import { createPost, getAllPosts } from '../controllers/post.controller.js'
import { postUploads } from '../middleware/multerUploads.middleware.js'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

router.route('/').post(postUploads, createPost).get(getAllPosts)

export { router as default }
