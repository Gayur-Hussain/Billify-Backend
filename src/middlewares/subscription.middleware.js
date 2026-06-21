import { getSubscriptionStatus } from '../utils/subscription.js'
import { ApiError } from '../utils/ApiError.js'

/**
 * Middleware to restrict expired subscriptions
 */
export const checkSubscription = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Unauthorized'))
  }

  const status = getSubscriptionStatus(req.user)

  if (status === 'expired') {
    return next(new ApiError(403, 'Subscription expired'))
  }

  next()
}
