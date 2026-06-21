import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true
    },
    otp: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300 // OTP automatically deleted after 5 minutes
    }
  }
)

export default mongoose.model('Otp', otpSchema)
