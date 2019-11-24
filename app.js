require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const azureTablesStoreFactory = require('connect-azuretables')(session);
const flash = require('connect-flash');
const passport = require('passport');
const hbs = require('hbs');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const graph = require('./api/graph');
const oauth2 = require('./config/oauth2');
const app = express();

//#region OIDCStrategy auth
passport.serializeUser(function (user, done) { done(null, user); });
passport.deserializeUser(function (user, done) { done(null, user); });
async function onVerifySignin(_iss, _sub, profile, accessToken, _refreshToken, params, done) {
  if (!profile.oid) return done(new Error("No OID found in user profile."), null);
  if (profile._json.tid != process.env.OAUTH_TENANT_ID) return done(new Error("No access"), null);
  try {
    const user = await graph.getUserDetails(accessToken);
    if (user) {
      profile['email'] = user.mail ? user.mail : user.userPrincipalName;
    }
  } catch (err) {
    done(err, null);
  }
  let { token } = oauth2.accessToken.create(params);
  return done(null, { profile, oauthToken: token });
}
passport.use(new OIDCStrategy(
  {
    identityMetadata: `${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}`,
    clientID: process.env.OAUTH_APP_ID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: process.env.OAUTH_REDIRECT_URI,
    allowHttpForRedirectUrl: true,
    clientSecret: process.env.OAUTH_APP_PASSWORD,
    validateIssuer: false,
    passReqToCallback: false,
    scope: process.env.OAUTH_SCOPES.split(' ')
  },
  onVerifySignin
));
//#endregion

//#region Setting up session using connect-azuretables
app.use(session({
  store: azureTablesStoreFactory.create({ table: 'Sessions', sessionTimeOut: 30 }),
  secret: process.env.SESSION_SIGNING_KEY,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: 600000 },
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

//#region Routes/APIs
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./api'));
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
