const graphService = require('../../services/graph');
const { getSubscription } = require('../../services/table');
const oauth2 = require('../../config/oauth2');

async function onVerifySignin(_iss, _sub, profile, accessToken, _refreshToken, params, done) {
    if (!profile.oid) return done(new Error("No OID found in user profile."), null);
    try {
        const sub = await getSubscription(profile._json.tid);
        if (!sub) {
            return done(new Error("No access"), null);
        }
        const user = await new graphService(accessToken).getUserDetails();
        if (user) {
            profile['email'] = user.mail ? user.mail : user.userPrincipalName;
        }
    } catch (err) {
        done(err, null);
    }
    let { token } = oauth2.accessToken.create(params);
    return done(null, { profile, oauthToken: token });
}

module.exports = onVerifySignin;