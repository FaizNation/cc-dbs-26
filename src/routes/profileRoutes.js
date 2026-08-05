const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const UserService = require('../services/UserService');
const ApplicationService = require('../services/ApplicationService');
const BookmarkService = require('../services/BookmarkService');

const router = express.Router();
const userService = new UserService();
const applicationService = new ApplicationService();
const bookmarkService = new BookmarkService();

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const user = await userService.getUserById(userId);
    res.json({
      status: 'success',
      data: {
        ...user,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/applications', async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const applications = await applicationService.getApplicationsByUser(userId);
    res.json({
      status: 'success',
      data: {
        applications,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/bookmarks', async (req, res, next) => {
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
