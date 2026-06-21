import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'system'
    },
    trialDays: {
      type: Number,
      default: 2
    },
    monthlyPrice: {
      type: Number,
      default: 299
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  { timestamps: true }
)

export default mongoose.model('Settings', settingsSchema)
