require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, _, next) => {
  const { cookie } = req.headers;

  if (!cookie) {
    throw new UnauthorizedError('Требуется авторизация');
  }
  const token = cookie.replace('jwt=', '');

  let payload;
  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    throw new UnauthorizedError('Требуется авторизация');
  }
  req.user = payload;

  return next();
};
