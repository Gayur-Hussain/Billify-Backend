import { Router } from 'express'
import { getMe } from './user.controller.js'
import { auth } from '../../middlewares/auth.middleware.js'

const router = Router()

router.get('/me', auth, getMe)

export default router
