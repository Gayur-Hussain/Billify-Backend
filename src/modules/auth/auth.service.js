import jwt from 'jsonwebtoken'
import { env } from '../../config/env.js'
import * as repo from './auth.repository.js'
import { ApiError } from '../../utils/ApiError.js'
import { sendOtpEmail, sendPasswordResetEmail } from '../../utils/email.js'

// Helper to generate a 6-digit numeric OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const register = async ({ email, password }) => {
  const existingUser = await repo.findByEmail(email)

  if (existingUser) {
    if (existingUser.isVerified) {
      throw new ApiError(400, 'Email is already registered and verified')
    }
    // If user exists but is unverified, update their password so they can retry registration
    existingUser.password = password
    await existingUser.save()
  } else {
    // Create new unverified user
    await repo.createUser({ email, password })
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

  // Find user and mark verified
  const user = await repo.findByEmail(email)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  user.isVerified = true
  await user.save()

  // Clean up OTP records
  await repo.deleteOtp(email)

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, env.jwtSecret, { expiresIn: '1d' })

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      isVerified: user.isVerified
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

export const login = async ({ email, password }) => {
  const user = await repo.findByEmail(email)
  if (!user) {
    throw new ApiError(401, 'Invalid credentials')
  }

  const isPasswordMatch = await user.comparePassword(password)
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid credentials')
  }

  if (!user.isVerified) {
    // Automatically trigger resend OTP so they have a fresh one
    const otp = generateOtp()
    await repo.saveOtp(email, otp)
    await sendOtpEmail(email, otp)
    throw new ApiError(403, 'Email is not verified. A new verification OTP code has been sent to your email.')
  }

  const token = jwt.sign({ id: user._id }, env.jwtSecret, { expiresIn: '1d' })

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      isVerified: user.isVerified
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

