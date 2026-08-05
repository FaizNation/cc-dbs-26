const express = require('express');
const UserService = require('../services/UserService');
const UsersValidator = require('../validator/Users');

const router = express.Router();
const userService = new UserService();

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
    const user = await userService.getUserById(req.params.id);

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

module.exports = router;
