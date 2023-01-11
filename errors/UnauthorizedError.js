const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

module.exports = handleAuthError;
