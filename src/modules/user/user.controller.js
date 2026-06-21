import { ApiResponse } from '../../utils/ApiResponse.js'
import { getSubscriptionStatus, getDaysLeft } from '../../utils/subscription.js'

export const getMe = async (req, res) => {
  const user = req.user
  
  const status = getSubscriptionStatus(user)
  const daysLeft = getDaysLeft(user, status)

  res.status(200).json(
    new ApiResponse(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        deviceId: user.deviceId,
        status,
        daysLeft,
        trialEndsAt: user.trialEndsAt,
        subscriptionEndsAt: user.subscriptionEndsAt
      },
      'User profile retrieved successfully'
    )
  )
}
