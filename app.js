require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const passport = require('./middleware/passport');
const isAuthenticated = require('./middleware/passport/isAuthenticated');
const hbs = require('hbs');
const app = express();

process.title = 'did365';

//#region Setting up session using connect-azuretables
app.use(require('./middleware/session'));
//#endregion

//#region Flash
app.use(flash());
app.use((req, res, next) => {
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
app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user.profile;
  }
  next();
});
//#endregion

//#region Routes/middleware
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/graphql', isAuthenticated, require('./middleware/graphql'));
//#endregion

//#region Error handling
app.use((_req, _res, next) => {
  next(createError(404));
});
app.use((err, req, res, _next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
//#endregion

module.exports = app;
