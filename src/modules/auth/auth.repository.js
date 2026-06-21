import User from '../../database/models/user.model.js'
import Otp from '../../database/models/otp.model.js'

// User queries
export const findByEmail = (email) => {
  return User.findOne({ email })
}

export const createUser = ({ email, password }) => {
  return User.create({ email, password })
}

export const updateUserVerification = async (email, isVerified) => {
  return User.findOneAndUpdate({ email }, { isVerified }, { new: true })
}

// OTP queries
export const findOtp = (email, otp) => {
  return Otp.findOne({ email, otp })
}

export const saveOtp = async (email, otp) => {
  // Clear any existing OTP for this email first
  await Otp.deleteMany({ email })
  return Otp.create({ email, otp })
}

export const deleteOtp = (email) => {
  return Otp.deleteMany({ email })
}
