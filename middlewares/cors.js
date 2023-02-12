// const allowedMethods = 'GET,HEAD,PUT,PATCH,POST,DELETE';
// const allowedCors = [
//   'https://mooslim-mesto.nomoredomainsclub.ru',
//   'http://mooslim-mesto.nomoredomainsclub.ru',
//   'https://localhost:3000',
//   'http://localhost:3000',
//   'https://localhost:3001',
//   'http://localhost:3001',
// ];

// module.exports = (req, res, next) => {
//   const { method } = req;
//   const { origin } = req.headers;

//   const requestHeaders = req.headers['access-control-request-headers'];

//   console.log(111, method);
//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', allowedCors);
//     // res.header('Access-Control-Allow-Origin', origin);
//     res.header('Access-Control-Allow-Credentials', true);
//   }
//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', allowedMethods);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     res.end();
//     return;
//   }
//   next();
// };

// module.exports = (req, res, next) => {
//   const { origin } = req.headers;
//   const { method } = req;
//   console.log(111, req.headers);
//   const requestHeaders = req.headers['access-control-request-headers'];
//   const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
//   res.header('Access-Control-Allow-Origin', origin);
//   res.header('Access-Control-Allow-Credentials', true);
//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     return res.end();
//   }
//   return next();
// };
