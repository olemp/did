const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


passport.use(new OIDCStrategy(
    {
        identityMetadata: `${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}`,
        clientID: process.env.OAUTH_APP_ID,
        responseType: process.env.OAUTH_RESPONSE_TYPE,
        responseMode: process.env.OAUTH_RESPONSE_MODE,
        redirectUrl: process.env.OAUTH_REDIRECT_URI,
        allowHttpForRedirectUrl: true,
        clientSecret: process.env.OAUTH_APP_PASSWORD,
        validateIssuer: false,
        passReqToCallback: false,
        scope: process.env.OAUTH_SCOPES.split(' ')
    },
    require('./onVerifySignin'),
));

module.exports = passport;