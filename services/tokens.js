const log = require('debug')('services/tokens');
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
            log('Checking if access token has expired: %s', storedToken.expired());
            if (storedToken.expired()) {
                log('Access token has expired. Attempting to refresh: %s', JSON.stringify(req.user.oauthToken));
                try {
                    var { token: oauthToken } = await storedToken.refresh();
                    req.user.oauthToken = oauthToken;
                    log('Successfully refreshed auth token');
                } catch (error) {
                    console.log(error);
                    log('Failed to refresh access token');
                }
            }
        }
    }
};