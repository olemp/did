
const session = require('express-session');
const azureTablesStoreFactory = require('connect-azuretables')(session);

const store = azureTablesStoreFactory.create({
    table: 'Sessions',
    sessionTimeOut: 30,
    logger: console.log,
    errorLogger: console.log,
});

module.exports = session({
    store: store,
    secret: process.env.SESSION_SIGNING_KEY,
    resave: false,
    saveUninitialized: false,
    rolling: true,
});