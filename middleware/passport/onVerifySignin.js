const StorageService = require('../../services/storage');

async function onVerifySignin(_iss, _sub, profile, _accessToken, _refreshToken, params, done) {
    if (!profile.oid) return done(new Error("No OID found in user profile."), null);
    try {
        const sub = await new StorageService(profile._json.tid).getSubscription();
        if (!sub) return done(new Error("No access"), null);
        profile['email'] = profile._json.preferred_username;
        profile['sub'] = sub.name;
    } catch (err) {
        done(err, null);
    }
    return done(null, { profile, oauthToken: params });
}

module.exports = onVerifySignin;