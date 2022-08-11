// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://api.somethingawesome.students.nomoredomains.sbs/',
  'http://api.somethingawesome.students.nomoredomains.sbs/',
  'http://api.somethingawesome.students.nomoredomains.sbs',
  'https://api.somethingawesome.students.nomoredomains.sbs/',
  'https://somethingawesome.nomoredomains.sbs/',
  'http://somethingawesome.nomoredomains.sbs/',
  'http://somethingawesome.nomoredomains.sbs',
  'https://somethingawesome.nomoredomains.sbs',
  'http://localhost:3000',
  'https://localhost:3000',
  'localhost:3000',
  '51.250.99.219',
  'http://51.250.99.219/',
  'https://51.250.99.219/',
  'http://51.250.99.219',
  'https://51.250.99.219',
];

const corsRules = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};

module.exports = {
  corsRules,
};
