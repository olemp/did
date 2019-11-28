module.exports = (req, res, next) => {
    if (!req.user || !req.isAuthenticated()) {
        res.redirect('/');
    } else {
        next();
    }
};