import { Router } from 'express'
import { getUsers } from './user.controller.js'
import { auth } from '../../middlewares/auth.middleware.js'

const router = Router()

router.get('/', auth, getUsers)

export default router
