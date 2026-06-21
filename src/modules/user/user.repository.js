import User from '../../database/models/user.model.js'

export const findAll = () => User.find()
