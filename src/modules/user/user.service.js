import * as repo from './user.repository.js'

export const getUsers = () => repo.findAll()
