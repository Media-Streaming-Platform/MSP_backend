const express = require('express')
const router = express.Router()

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller')


router.post('/create-category', createCategory)
router.get('/get-all-categories', getAllCategories)
router.get('/get-by-id/:id', getCategoryById)
router.put('/update-category/:id', updateCategory)
router.delete('/delete-category/:id', deleteCategory)
module.exports = router