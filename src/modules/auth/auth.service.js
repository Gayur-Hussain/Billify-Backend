import jwt from 'jsonwebtoken'
import { env } from '../../config/env.js'
import * as repo from './auth.repository.js'
import Settings from '../../database/models/settings.model.js'
import { ApiError } from '../../utils/ApiError.js'
import { sendOtpEmail, sendPasswordResetEmail } from '../../utils/email.js'
import { getSubscriptionStatus, getDaysLeft } from '../../utils/subscription.js'

// Helper to generate a 6-digit numeric OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const register = async ({ name, email, password, deviceId }) => {
  const existingUser = await repo.findByEmail(email)

  if (existingUser) {
    if (existingUser.isVerified) {
      throw new ApiError(400, 'Email is already registered and verified')
    }
    // If user exists but is unverified, update their details so they can retry registration
    existingUser.name = name
    existingUser.password = password
    existingUser.deviceId = deviceId
    await existingUser.save()
  } else {
    // Create new unverified user
    await repo.createUser({ name, email, password, deviceId })
  }

  // Generate and send OTP
  const otp = generateOtp()
  await repo.saveOtp(email, otp)
  await sendOtpEmail(email, otp)

  return { message: 'Registration initiated. OTP code sent to your email.' }
}

export const verifyOtp = async ({ email, otp }) => {
  const otpRecord = await repo.findOtp(email, otp)
  if (!otpRecord) {
    throw new ApiError(400, 'Invalid or expired OTP')
  }

  // Find user
  const user = await repo.findByEmail(email)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  // Fetch dynamic trial days from Settings
  let systemSettings = await Settings.findOne({ key: 'system' })
  if (!systemSettings) {
    // Create default settings if not exists
    systemSettings = await Settings.create({
      key: 'system',
      trialDays: 2,
      monthlyPrice: 299,
      currency: 'INR'
    })
  }

  const trialDays = systemSettings.trialDays || 2

  // Initialize the 2-day (or setting-defined) trial
  user.isVerified = true
  user.trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000)
  await user.save()

  // Clean up OTP records
  await repo.deleteOtp(email)

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, env.jwtSecret, { expiresIn: '1d' })

  const status = getSubscriptionStatus(user)
  const daysLeft = getDaysLeft(user, status)

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      deviceId: user.deviceId,
      trialEndsAt: user.trialEndsAt,
      subscriptionEndsAt: user.subscriptionEndsAt,
      status,
      daysLeft
    }
  }
}

export const resendOtp = async ({ email }) => {
  const user = await repo.findByEmail(email)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  if (user.isVerified) {
    throw new ApiError(400, 'User is already verified')
  }

  const otp = generateOtp()
  await repo.saveOtp(email, otp)
  await sendOtpEmail(email, otp)

  return { message: 'OTP code resent to your email.' }
}

export const login = async ({ email, password, deviceId }) => {
  const user = await repo.findByEmail(email)
  if (!user) {
    throw new ApiError(401, 'Invalid credentials')
  }

  // Check if user is disabled
  if (user.isDisabled) {
    throw new ApiError(403, 'Your account has been disabled. Please contact the administrator.')
  }

  const isPasswordMatch = await user.comparePassword(password)
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid credentials')
  }

  // Device Lock Protection: Check if deviceId matches
  if (user.deviceId !== deviceId) {
    throw new ApiError(400, 'New Device Detected. Access restricted to the registered device.')
  }

  if (!user.isVerified) {
    // Automatically trigger resend OTP
    const otp = generateOtp()
    await repo.saveOtp(email, otp)
    await sendOtpEmail(email, otp)
    throw new ApiError(403, 'Email is not verified. A new verification OTP code has been sent to your email.')
  }

  const token = jwt.sign({ id: user._id }, env.jwtSecret, { expiresIn: '1d' })

  const status = getSubscriptionStatus(user)
  const daysLeft = getDaysLeft(user, status)

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      deviceId: user.deviceId,
      trialEndsAt: user.trialEndsAt,
      subscriptionEndsAt: user.subscriptionEndsAt,
      status,
      daysLeft
    }
  }
}

export const forgotPassword = async ({ email }) => {
  const user = await repo.findByEmail(email)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  // Generate and save recovery OTP
  const otp = generateOtp()
  await repo.saveOtp(email, otp)
  await sendPasswordResetEmail(email, otp)

  return { message: 'Password reset OTP code sent to your email.' }
}

export const resetPassword = async ({ email, otp, newPassword }) => {
  const otpRecord = await repo.findOtp(email, otp)
  if (!otpRecord) {
    throw new ApiError(400, 'Invalid or expired OTP')
  }

  const user = await repo.findByEmail(email)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  // Update password (pre-save hook will hash it)
  user.password = newPassword
  // Ensure user is verified if they reset password successfully
  user.isVerified = true
  await user.save()

  // Clean up OTP records
  await repo.deleteOtp(email)

  return { message: 'Password reset successful. You can now login with your new password.' }
}
