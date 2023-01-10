const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');

// const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, _, next) => {
  // закоментрированный код не работает - никто не отвечает почему
  // const { Authorization } = req.headers;

  // if (!Authorization || !Authorization.startsWith('Bearer ')) {
  //   next(new UnauthorizedError('Требуется авторизация'));
  // }
  // const token = extractBearerToken(Authorization);

  // иначе не работает авторизация. Причину не нашел - в request не приходят заголовки (headers)
  const token = req.rawHeaders.find((el) => el.match('jwt')).replace('jwt=', '');

  if (!token) {
    next(new UnauthorizedError('Требуется авторизация'));
  }
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new UnauthorizedError('Требуется авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
