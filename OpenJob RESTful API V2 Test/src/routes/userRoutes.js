const express = require('express');
const UserService = require('../services/UserService');
const UsersValidator = require('../validator/Users');
const CacheService = require('../cache/CacheService');

const router = express.Router();
const userService = new UserService();
const cacheService = new CacheService();

router.post('/', async (req, res, next) => {
  try {
    UsersValidator.validateUserPayload(req.body);
    const userId = await userService.addUser(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        id: userId,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const cacheKey = `users:${req.params.id}`;
    try {
      const cachedData = await cacheService.get(cacheKey);
      return res.set('X-Data-Source', 'cache').json({
        status: 'success',
        data: JSON.parse(cachedData),
      });
    } catch (error) {
      const user = await userService.getUserById(req.params.id);
      await cacheService.set(cacheKey, JSON.stringify(user));
      res.set('X-Data-Source', 'database').json({
        status: 'success',
        data: {
          ...user,
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
