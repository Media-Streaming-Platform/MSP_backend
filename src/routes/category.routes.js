const express = require('express')
const router = express.Router()

const {
  createCategory,
  getAllCategories
} = require('../controllers/category.controller')


router.post('/create-category', createCategory)
router.get('/get-all-categories', getAllCategories)

module.exports = router