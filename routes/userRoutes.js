const express = require('express')
const User = require('../controllers/userController')
const userController = new User()
const isUserAuthorized = require('../authorization/isUserAuthorized')
const userRouter = express.Router()


userRouter.post('/', userController.createUser)
userRouter.post('/login', userController.login)
userRouter.get('/', isUserAuthorized.authenticateUser, userController.getUsers)
userRouter.patch('/logout', isUserAuthorized.authenticateUser, userController.logout)
userRouter.post('/upload', userController.uploadFile)


module.exports = userRouter