import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string().url().optional(),
  MONGODB_URI: z.string().url().optional(),
  JWT_SECRET: z.string().default('supersecret_change_me_in_production'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM: z.string().email().default('onboarding@resend.dev')
}).refine(data => data.MONGO_URI || data.MONGODB_URI, {
  message: 'Either MONGO_URI or MONGODB_URI must be provided',
  path: ['MONGO_URI']
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  console.error(JSON.stringify(parsed.error.format(), null, 2))
  process.exit(1)
}

const data = parsed.data

export const env = {
  port: data.PORT,
  mongoUri: data.MONGO_URI || data.MONGODB_URI,
  jwtSecret: data.JWT_SECRET,
  nodeEnv: data.NODE_ENV,
  resendApiKey: data.RESEND_API_KEY,
  resendFrom: data.RESEND_FROM
}
