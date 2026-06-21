import User from '../../database/models/user.model.js'
import Settings from '../../database/models/settings.model.js'
import { ApiError } from '../../utils/ApiError.js'
import { getSubscriptionStatus, getDaysLeft } from '../../utils/subscription.js'

export const listUsers = async () => {
  const users = await User.find({}).sort({ createdAt: -1 })
  
  return users.map(user => {
    const status = getSubscriptionStatus(user)
    const daysLeft = getDaysLeft(user, status)
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      deviceId: user.deviceId,
      trialEndsAt: user.trialEndsAt,
      subscriptionEndsAt: user.subscriptionEndsAt,
      isDisabled: user.isDisabled,
      status,
      daysLeft
    }
  })
}

export const activateSubscription = async ({ userId, months }) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  // Set subscription to end 'months' from now
  const expiryDate = new Date()
  expiryDate.setMonth(expiryDate.getMonth() + months)

  user.subscriptionEndsAt = expiryDate
  await user.save()

  const status = getSubscriptionStatus(user)
  const daysLeft = getDaysLeft(user, status)

  return {
    userId: user._id,
    subscriptionEndsAt: user.subscriptionEndsAt,
    status,
    daysLeft
  }
}

export const extendSubscription = async ({ userId, months }) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  const now = new Date()
  let baseDate = now

  // If the user has an active subscription, extend it from the current expiry date
  if (user.subscriptionEndsAt && new Date(user.subscriptionEndsAt) > now) {
    baseDate = new Date(user.subscriptionEndsAt)
  }

  baseDate.setMonth(baseDate.getMonth() + months)
  user.subscriptionEndsAt = baseDate
  await user.save()

  const status = getSubscriptionStatus(user)
  const daysLeft = getDaysLeft(user, status)

  return {
    userId: user._id,
    subscriptionEndsAt: user.subscriptionEndsAt,
    status,
    daysLeft
  }
}

export const disableUser = async ({ userId }) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  user.isDisabled = true
  await user.save()

  return {
    userId: user._id,
    isDisabled: user.isDisabled
  }
}

export const updateSettings = async (data) => {
  let settings = await Settings.findOne({ key: 'system' })

  if (!settings) {
    settings = new Settings({ key: 'system' })
  }

  if (data.trialDays !== undefined) settings.trialDays = data.trialDays
  if (data.monthlyPrice !== undefined) settings.monthlyPrice = data.monthlyPrice
  if (data.currency !== undefined) settings.currency = data.currency

  await settings.save()

  return {
    trialDays: settings.trialDays,
    monthlyPrice: settings.monthlyPrice,
    currency: settings.currency
  }
}
