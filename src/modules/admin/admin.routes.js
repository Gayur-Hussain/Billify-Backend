import { Router } from 'express'
import {
  listUsers,
  activateSubscription,
  extendSubscription,
  disableUser,
  updateSettings
} from './admin.controller.js'
import { auth } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { ApiError } from '../../utils/ApiError.js'
import {
  activateSubscriptionSchema,
  extendSubscriptionSchema,
  disableUserSchema,
  updateSettingsSchema
} from './admin.validation.js'

const router = Router()

// Middleware to ensure the authenticated user has an 'admin' role
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Access denied. Administrator privileges required.'))
  }
  next()
}

// All admin routes require authentication and admin privileges
router.use(auth, adminOnly)

router.get('/users', listUsers)
router.post('/activate', validate(activateSubscriptionSchema), activateSubscription)
router.post('/extend', validate(extendSubscriptionSchema), extendSubscription)
router.post('/disable', validate(disableUserSchema), disableUser)
router.put('/settings', validate(updateSettingsSchema), updateSettings)

export default router
