require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, _, next) => {
  if (!req.cookies.jwt) {
    throw new UnauthorizedError('Требуется авторизация');
  }

  const token = req.cookies.jwt;

  let payload;
  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    throw new UnauthorizedError('Требуется авторизация');
  }
  req.user = payload;

  return next();
};
