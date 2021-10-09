const express = require('express')
const Post = require('../controllers/postController')
const postController = new Post()
const postRouter = express.Router()
const isUserAuthorized = require('../authorization/isUserAuthorized')

postRouter.post('/', isUserAuthorized.authenticateUser, postController.createPost)
postRouter.patch('/:postId', isUserAuthorized.authenticateUser, postController.updatePost)
postRouter.get('/book-marked', isUserAuthorized.authenticateUser, postController.getBookmarkedPosts)
postRouter.post('/add-bookmark/:postId', isUserAuthorized.authenticateUser, postController.bookMarkPost)
postRouter.delete('/remove-bookmark/:postId', isUserAuthorized.authenticateUser, postController.removeBookMarkPost)
postRouter.get('/', postController.getPosts)
postRouter.get('/:postId', postController.getPost)
module.exports = postRouter