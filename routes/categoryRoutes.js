const express = require('express')
const Category = require('../controllers/categoryController')
const categoryController = new Category()
const categoryRouter = express.Router()


categoryRouter.post('/', categoryController.addCategory)
categoryRouter.get('/', categoryController.getCategories)


module.exports = categoryRouter