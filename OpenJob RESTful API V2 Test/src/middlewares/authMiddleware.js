const jwt = require('jsonwebtoken');
const AuthenticationError = require('../utils/AuthenticationError');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Missing or invalid header, throwing AuthenticationError');
    return next(new AuthenticationError('Missing or invalid authorization header'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AuthenticationError('Invalid or expired access token'));
  }
};

module.exports = authMiddleware;
