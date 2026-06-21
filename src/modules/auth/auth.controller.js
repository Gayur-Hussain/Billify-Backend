import * as service from './auth.service.js'
import { ApiResponse } from '../../utils/ApiResponse.js'

export const register = async (req, res) => {
  const result = await service.register(req.body)
  res.status(201).json(new ApiResponse(result, 'Registration initiated successfully'))
}

export const verifyOtp = async (req, res) => {
  const result = await service.verifyOtp(req.body)
  res.status(200).json(new ApiResponse(result, 'Email verification successful'))
}

export const resendOtp = async (req, res) => {
  const result = await service.resendOtp(req.body)
  res.status(200).json(new ApiResponse(result, 'Verification OTP sent successfully'))
}

export const login = async (req, res) => {
  const result = await service.login(req.body)
  res.status(200).json(new ApiResponse(result, 'Login successful'))
}

export const forgotPassword = async (req, res) => {
  const result = await service.forgotPassword(req.body)
  res.status(200).json(new ApiResponse(result, 'Password reset OTP code sent successfully'))
}

export const resetPassword = async (req, res) => {
  const result = await service.resetPassword(req.body)
  res.status(200).json(new ApiResponse(result, 'Password reset successful'))
}

