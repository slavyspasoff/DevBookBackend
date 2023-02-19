import { Router } from 'express'
import passport from 'passport'

import {
  getAllUsers,
  getUser,
  updateUser,
  addRemoveFriend,
} from '../controllers/user.controller.js'
import { profileUploads } from '../middleware/multerUploads.middleware.js'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

router.get('/', getAllUsers)
router.route('/:id').get(getUser).patch(profileUploads, updateUser)
router.patch('/addRemoveFriends/:id', addRemoveFriend)
export { router as default }
