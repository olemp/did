
const session = require('express-session');
const connectAzureTables = require('connect-azuretables')(session);

const store = connectAzureTables.create({
    table: process.env.AZURE_STORAGE_SESSIONS_TABLE_NAME,
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