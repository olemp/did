const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const graph = require('../../services/graph');
const { getSubscription } = require('../../services/table');
const oauth2 = require('../../config/oauth2');

passport.serializeUser(function (user, done) { done(null, user); });

passport.deserializeUser(function (user, done) { done(null, user); });

async function onVerifySignin(_iss, _sub, profile, accessToken, _refreshToken, params, done) {
    if (!profile.oid) return done(new Error("No OID found in user profile."), null);
    try {
        const sub = await getSubscription(profile._json.tid);
        if (!sub) {
            return done(new Error("No access"), null);
        }
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

module.exports = passport;