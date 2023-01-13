const jwt = require('jsonwebtoken');
const HandleAuthError = require('../errors/UnauthorizedError');
// const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  // закоментированный код не работает - никто не отвечает почему
  // const { Authorization } = req.headers;

  // if (!Authorization || !Authorization.startsWith('Bearer ')) {
  //   next(new UnauthorizedError('Требуется авторизация'));
  // }
  // const token = extractBearerToken(Authorization);

  // иначе не работает авторизация. Причину не нашел - в request не приходят заголовки (headers)
  const token = req.rawHeaders.find((el) => el.match('jwt')) ? req.rawHeaders.find((el) => el.match('jwt')).replace('jwt=', '') : 0;

  if (!token) {
    throw new HandleAuthError('Требуется авторизация');
  }
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new HandleAuthError('Требуется авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
