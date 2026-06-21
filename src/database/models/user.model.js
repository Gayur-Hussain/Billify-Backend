import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    deviceId: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    trialEndsAt: { type: Date },
    subscriptionEndsAt: { type: Date },
    isDisabled: { type: Boolean, default: false }
  },
  { timestamps: true }
)

// Hash the password before saving it
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema)
