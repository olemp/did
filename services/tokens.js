const simpleoauth2 = require('simple-oauth2').create({
    client: {
        id: process.env.OAUTH_APP_ID,
        secret: process.env.OAUTH_APP_PASSWORD
    },
    auth: {
        tokenHost: process.env.OAUTH_AUTHORITY,
        authorizePath: process.env.OAUTH_AUTHORIZE_ENDPOINT,
        tokenPath: process.env.OAUTH_TOKEN_ENDPOINT
    }
});

module.exports = {
    ensureAccessToken: async function (req) {
        var storedToken = simpleoauth2.accessToken.create(req.user.oauthToken);
        if (storedToken) {
            if (storedToken.expired()) {
                var newToken = await storedToken.refresh();
                req.user.oauthToken = newToken;
            }
        }
    }
};