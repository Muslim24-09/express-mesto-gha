require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, _, next) => {
  console.log(req.headers.authorization);
  if (!req.headers.authorization) {
    throw new UnauthorizedError('111 Требуется авторизация');
  }

  const token = req.headers.cookie.replace('jwt=', '');

  let payload;
  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    throw new UnauthorizedError('222 Требуется авторизация');
  }
  req.user = payload;

  return next();
};
