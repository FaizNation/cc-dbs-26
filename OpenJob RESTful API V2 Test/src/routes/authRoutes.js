const express = require('express');
const UserService = require('../services/UserService');
const AuthService = require('../services/AuthService');
const AuthenticationsValidator = require('../validator/Authentications');
const TokenManager = require('../utils/TokenManager');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const userService = new UserService();
const authService = new AuthService();

router.post('/', async (req, res, next) => {
  try {
    AuthenticationsValidator.validatePostAuthenticationPayload(req.body);
    const { email, password } = req.body;
    const id = await userService.verifyUserCredential(email, password);

    const accessToken = TokenManager.generateAccessToken({ id });
    const refreshToken = TokenManager.generateRefreshToken({ id });

    await authService.addRefreshToken(refreshToken);

    res.status(200).json({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    AuthenticationsValidator.validatePutAuthenticationPayload(req.body);
    const { refreshToken } = req.body;
    await authService.verifyRefreshToken(refreshToken);
    const { id } = TokenManager.verifyRefreshToken(refreshToken);

    const accessToken = TokenManager.generateAccessToken({ id });
    res.json({
      status: 'success',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/', authMiddleware, async (req, res, next) => {
  try {
    AuthenticationsValidator.validateDeleteAuthenticationPayload(req.body);
    const { refreshToken } = req.body;
    await authService.verifyRefreshToken(refreshToken);
    await authService.deleteRefreshToken(refreshToken);

    res.json({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
