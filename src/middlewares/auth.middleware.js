import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) throw new ApiError(401, 'Unauthorized')

  try {
    req.user = jwt.verify(token, env.jwtSecret)
    next()
  } catch {
    throw new ApiError(401, 'Invalid token')
  }
}
