const ensureAccessToken = require('../../services/tokens').ensureAccessToken;

module.exports = async (req, res, next) => {
    if (!req.user || !req.isAuthenticated()) {
        res.redirect('/');
    } else {
        await ensureAccessToken(req);
        next();
    }
};