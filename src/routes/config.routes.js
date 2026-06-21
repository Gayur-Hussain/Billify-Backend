import { Router } from 'express'
import Settings from '../database/models/settings.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ key: 'system' })

    if (!settings) {
      // Seed default settings if not initialized
      settings = await Settings.create({
        key: 'system',
        trialDays: 2,
        monthlyPrice: 299,
        currency: 'INR'
      })
    }

    res.status(200).json(
      new ApiResponse(
        {
          trialDays: settings.trialDays,
          monthlyPrice: settings.monthlyPrice,
          currency: settings.currency
        },
        'System configuration retrieved successfully'
      )
    )
  } catch (err) {
    next(err)
  }
})

export default router
