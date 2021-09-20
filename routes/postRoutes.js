const express = require('express')
const Post = require('../controllers/postController')
const postController = new Post()
const postRouter = express.Router()
const isUserAuthorized = require('../authorization/isUserAuthorized')

postRouter.post('/', isUserAuthorized.authenticateUser, postController.createPost)
postRouter.get('/', postController.getPosts)
postRouter.get('/:postId', postController.getPost)
postRouter.patch('/:postId', isUserAuthorized.authenticateUser, postController.updatePost)


module.exports = postRouter