/**
 * Get subscription status based on user limits and dates
 * @param {object} user 
 * @returns {string} 'disabled' | 'active' | 'trial' | 'expired'
 */
export const getSubscriptionStatus = (user) => {
  if (user.isDisabled) {
    return 'disabled'
  }

  const now = new Date()

  // 1. Check active subscription
  if (user.subscriptionEndsAt && new Date(user.subscriptionEndsAt) > now) {
    return 'active'
  }

  // 2. Check active free trial
  if (user.trialEndsAt && new Date(user.trialEndsAt) > now) {
    return 'trial'
  }

  return 'expired'
}

/**
 * Get days remaining for trial or active subscription
 * @param {object} user 
 * @param {string} status 
 * @returns {number} days remaining
 */
export const getDaysLeft = (user, status) => {
  const now = new Date()
  let targetDate = null

  if (status === 'active') {
    targetDate = user.subscriptionEndsAt
  } else if (status === 'trial') {
    targetDate = user.trialEndsAt
  }

  if (!targetDate) {
    return 0
  }

  const diffMs = new Date(targetDate) - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}
