import { Resend } from 'resend'
import { env } from '../config/env.js'

const resend = new Resend(env.resendApiKey)

/**
 * Send an OTP verification email to the user
 * @param {string} toEmail 
 * @param {string} otp 
 */
export const sendOtpEmail = async (toEmail, otp) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f4f7fa;
            color: #333333;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 540px;
            margin: 40px auto;
            padding: 40px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border: 1px solid #eef2f6;
          }
          .logo {
            font-size: 24px;
            font-weight: 700;
            color: #4F46E5;
            margin-bottom: 24px;
            text-align: center;
          }
          .title {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
            text-align: center;
          }
          .text {
            font-size: 15px;
            line-height: 24px;
            color: #64748b;
            margin-bottom: 30px;
            text-align: center;
          }
          .otp-container {
            background-color: #f8fafc;
            border: 1px dashed #cbd5e1;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            letter-spacing: 6px;
            font-size: 32px;
            font-weight: 700;
            color: #0f172a;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #94a3b8;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">⚡ AuthPortal</div>
          <h2 class="title">Email Verification Code</h2>
          <p class="text">
            Thank you for registering. Please use the following One-Time Password (OTP) to verify your account. This code is valid for 5 minutes.
          </p>
          <div class="otp-container">
            ${otp}
          </div>
          <p class="text" style="font-size: 13px;">
            If you did not request this verification, please ignore this email.
          </p>
          <div class="footer">
            &copy; 2026 AuthPortal. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `

  await resend.emails.send({
    from: env.resendFrom,
    to: toEmail,
    subject: '🔐 Verify Your Email Address - OTP Verification',
    html: htmlContent
  })
}

/**
 * Send a Password Reset OTP email to the user
 * @param {string} toEmail 
 * @param {string} otp 
 */
export const sendPasswordResetEmail = async (toEmail, otp) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f4f7fa;
            color: #333333;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 540px;
            margin: 40px auto;
            padding: 40px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border: 1px solid #eef2f6;
          }
          .logo {
            font-size: 24px;
            font-weight: 700;
            color: #EF4444;
            margin-bottom: 24px;
            text-align: center;
          }
          .title {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
            text-align: center;
          }
          .text {
            font-size: 15px;
            line-height: 24px;
            color: #64748b;
            margin-bottom: 30px;
            text-align: center;
          }
          .otp-container {
            background-color: #fcf8f8;
            border: 1px dashed #fca5a5;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            letter-spacing: 6px;
            font-size: 32px;
            font-weight: 700;
            color: #991b1b;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #94a3b8;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🔒 Password Recovery</div>
          <h2 class="title">Reset Verification Code</h2>
          <p class="text">
            We received a request to reset your account password. Please use the following One-Time Password (OTP) to complete the reset. This code is valid for 5 minutes.
          </p>
          <div class="otp-container">
            ${otp}
          </div>
          <p class="text" style="font-size: 13px;">
            If you did not request a password reset, please ignore this email and ensure your password is secure.
          </p>
          <div class="footer">
            &copy; 2026 AuthPortal. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `

  await resend.emails.send({
    from: env.resendFrom,
    to: toEmail,
    subject: '🔑 Reset Your Password - OTP Code',
    html: htmlContent
  })
}

