const express = require('express');
const BookmarkService = require('../services/BookmarkService');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const bookmarkService = new BookmarkService();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const bookmarks = await bookmarkService.getBookmarks(userId);
    res.json({
      status: 'success',
      data: {
        bookmarks,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
