import { z } from 'zod'

export const activateSubscriptionSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    months: z.number().int().positive('Months must be a positive integer')
  })
})

export const extendSubscriptionSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    months: z.number().int().positive('Months must be a positive integer')
  })
})

export const disableUserSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required')
  })
})

export const updateSettingsSchema = z.object({
  body: z.object({
    trialDays: z.number().int().nonnegative('Trial days must be non-negative').optional(),
    monthlyPrice: z.number().positive('Monthly price must be positive').optional(),
    currency: z.string().min(1).optional()
  })
})
