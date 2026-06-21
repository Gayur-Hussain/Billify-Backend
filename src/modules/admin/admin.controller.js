import * as service from './admin.service.js'
import { ApiResponse } from '../../utils/ApiResponse.js'

export const listUsers = async (req, res) => {
  const result = await service.listUsers()
  res.status(200).json(new ApiResponse(result, 'Users list retrieved successfully'))
}

export const activateSubscription = async (req, res) => {
  const result = await service.activateSubscription(req.body)
  res.status(200).json(new ApiResponse(result, 'User subscription activated successfully'))
}

export const extendSubscription = async (req, res) => {
  const result = await service.extendSubscription(req.body)
  res.status(200).json(new ApiResponse(result, 'User subscription extended successfully'))
}

export const disableUser = async (req, res) => {
  const result = await service.disableUser(req.body)
  res.status(200).json(new ApiResponse(result, 'User account disabled successfully'))
}

export const updateSettings = async (req, res) => {
  const result = await service.updateSettings(req.body)
  res.status(200).json(new ApiResponse(result, 'System settings updated successfully'))
}
