const express = require('express');
const CategoryService = require('../services/CategoryService');
const CategoriesValidator = require('../validator/Categories');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const categoryService = new CategoryService();

router.get('/', async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.json({
      status: 'success',
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json({
      status: 'success',
      data: {
        ...category,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    CategoriesValidator.validateCategoryPayload(req.body);
    const categoryId = await categoryService.addCategory(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        id: categoryId,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    CategoriesValidator.validateCategoryPayload(req.body);
    await categoryService.editCategoryById(req.params.id, req.body);
    res.json({
      status: 'success',
      message: 'Kategori berhasil diperbarui',
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await categoryService.deleteCategoryById(req.params.id);
    res.json({
      status: 'success',
      message: 'Kategori berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
