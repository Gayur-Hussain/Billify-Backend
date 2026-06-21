import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import User from '../database/models/user.model.js'

export const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return next(new ApiError(401, 'Unauthorized'))
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret)
    const user = await User.findById(decoded.id)

    if (!user) {
      return next(new ApiError(401, 'User not found'))
    }

    if (user.isDisabled) {
      return next(new ApiError(403, 'Your account has been disabled. Please contact the administrator.'))
    }

    req.user = user
    next()
  } catch (err) {
    next(new ApiError(401, 'Invalid or expired token'))
  }
}
