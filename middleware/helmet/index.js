const helmet = require('helmet');

module.exports = helmet({
    frameguard: true,
    hidePoweredBy: true,
    hsts: helmet.hsts({ maxAge: 5184000 }),
    ieNoOpen: true,
    noSniff: true,
});