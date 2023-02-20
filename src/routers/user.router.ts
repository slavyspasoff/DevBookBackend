import { Router } from 'express'
import passport from 'passport'

import {
  getAllUsers,
  getUser,
  updateSelf,
  addRemoveFriend,
} from '../controllers/user.controller.js'
import { profileUploads } from '../middleware/multerUploads.middleware.js'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

router.route('/').get(getAllUsers).patch(profileUploads, updateSelf)
router.route('/:id').get(getUser)
router.patch('/:id', addRemoveFriend)
export { router as default }
