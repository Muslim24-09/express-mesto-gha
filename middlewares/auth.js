const jwt = require('jsonwebtoken');

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

module.exports = (req, res, next) => {
  // иначе не работает авторизация. Причину не нашел
  const token = req.rawHeaders.find((el) => el.match('jwt')).replace('jwt=', '');

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   return handleAuthError(res);
  // }

  // const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
