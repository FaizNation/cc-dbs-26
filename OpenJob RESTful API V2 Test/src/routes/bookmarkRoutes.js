const express = require('express');
const BookmarkService = require('../services/BookmarkService');
const authMiddleware = require('../middlewares/authMiddleware');
const CacheService = require('../cache/CacheService');

const router = express.Router();
const bookmarkService = new BookmarkService();
const cacheService = new CacheService();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const cacheKey = `bookmarks:user:${userId}`;
    
    try {
      const cachedData = await cacheService.get(cacheKey);
      return res.set('X-Data-Source', 'cache').json({
        status: 'success',
        data: {
          bookmarks: JSON.parse(cachedData),
        },
      });
    } catch (error) {
      const bookmarks = await bookmarkService.getBookmarks(userId);
      await cacheService.set(cacheKey, JSON.stringify(bookmarks));
      res.set('X-Data-Source', 'database').json({
        status: 'success',
        data: {
          bookmarks,
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
