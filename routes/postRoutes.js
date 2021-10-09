const express = require('express')
const Post = require('../controllers/postController')
const postController = new Post()
const postRouter = express.Router()
const isUserAuthorized = require('../authorization/isUserAuthorized')

//Create POST
postRouter.post('/', isUserAuthorized.authenticateUser, postController.createPost)
postRouter.patch('/:postId', isUserAuthorized.authenticateUser, postController.updatePost)

//BOOK MARK
postRouter.get('/book-marked', isUserAuthorized.authenticateUser, postController.getBookmarkedPosts)
postRouter.post('/add-bookmark/:postId', isUserAuthorized.authenticateUser, postController.bookMarkPost)
postRouter.delete('/remove-bookmark/:postId', isUserAuthorized.authenticateUser, postController.removeBookMarkPost)

//LIKE POST
postRouter.post('/like/:postId', isUserAuthorized.authenticateUser, postController.likePost)
postRouter.delete('/unlike/:postId', isUserAuthorized.authenticateUser, postController.unlikePost)


postRouter.get('/', isUserAuthorized.authenticateUser, postController.getPosts)
postRouter.get('/:postId', postController.getPost)
module.exports = postRouter