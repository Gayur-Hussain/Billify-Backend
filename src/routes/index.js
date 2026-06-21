import { Router } from 'express'
import authRoutes from '../modules/auth/auth.routes.js'
import userRoutes from '../modules/user/user.routes.js'
import configRoutes from './config.routes.js'
import adminRoutes from '../modules/admin/admin.routes.js'

const router = Router()

router.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() })
})

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/config', configRoutes)
router.use('/admin', adminRoutes)

export default router
