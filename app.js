require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const azureTablesStoreFactory = require('connect-azuretables')(session);
const flash = require('connect-flash');
const passport = require('./middleware/passport');
const hbs = require('hbs');
const app = express();

//#endregion

//#region Setting up session using connect-azuretables
app.use(session({
  store: azureTablesStoreFactory.create({ table: 'Sessions', sessionTimeOut: 30, logger: console.log, errorLogger: console.log}),
  secret: process.env.SESSION_SIGNING_KEY,
  resave: false,
  saveUninitialized: false,
  rolling: true,
}));
//#endregion

//#region Flash
app.use(flash());
app.use(function (req, res, next) {
  res.locals.error = req.flash('error_msg');
  const errs = req.flash('error');
  for (const i in errs) {
    res.locals.error.push({ message: 'An error occurred', debug: errs[i] });
  }
  next();
});
//#endregion

//#region HBS views setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'))
//#endregion

//#region API setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//#endregion

//#region Passport
app.use(passport.initialize());
app.use(passport.session());
//#endregion

//#region Storing user
app.use(function (req, res, next) {
  if (req.user) {
    res.locals.user = req.user.profile;
  }
  next();
});
//#endregion

//#region Routes/middleware
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/graphql', require('./middleware/graphql'));
//#endregion

//#region Error handling
app.use(function (_req, _res, next) { next(createError(404)); });
app.use(function (err, req, res, _next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
//#endregion

module.exports = app;
