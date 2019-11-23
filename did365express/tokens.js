module.exports = {
  getTenantId: (req) => {
    if (req.user) return req.user.profile._json.tid;
    return null;
  },
  getAccessToken: async (req) => {
    if (req.user) {
      var storedToken = req.user.oauthToken;
      if (storedToken) {
        if (storedToken.expired()) {
          var newToken = await storedToken.refresh();
          req.user.oauthToken = newToken;
          return newToken.token.access_token;
        }
        return storedToken.token.access_token;
      }
    }
  }
};