const express = require('express');
const {
  addBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
} = require('../handlers/books');

const router = express.Router();

router.post('/', addBook);
router.get('/', getAllBooks);
router.get('/:bookId', getBookById);
router.put('/:bookId', updateBookById);
router.delete('/:bookId', deleteBookById);

module.exports = router;
