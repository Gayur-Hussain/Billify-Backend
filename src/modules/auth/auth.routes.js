import { Router } from 'express'
import { register, verifyOtp, resendOtp, login, forgotPassword, resetPassword } from './auth.controller.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { registerSchema, verifyOtpSchema, resendOtpSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.validation.js'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp)
router.post('/resend-otp', validate(resendOtpSchema), resendOtp)
router.post('/login', validate(loginSchema), login)
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword)
router.post('/reset-password', validate(resetPasswordSchema), resetPassword)

export default router

