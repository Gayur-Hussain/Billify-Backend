import * as service from './user.service.js'
import { ApiResponse } from '../../utils/ApiResponse.js'

export const getUsers = async (req, res) => {
  const users = await service.getUsers()
  res.status(200).json(new ApiResponse(users, 'Users retrieved successfully'))
}
