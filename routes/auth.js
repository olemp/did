var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET auth callback. */
router.get('/signin',
  (req, res, next) => {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        prompt: 'login',
        failureRedirect: '/',
        failureFlash: true
      }
    )(req, res, next);
  },
  (_req, res) => {
    res.redirect('/');
  }
);

router.post('/callback',
  (req, res, next) => {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        failureRedirect: '/',
        failureFlash: true
      }
    )(req, res, next);
  },
  (_req, res) => {
    res.redirect('/');
  }
);

router.get('/signout',
  (req, res) => {
    req.session.destroy((_err) {
      req.logout();
      res.redirect('/');
    });
  }
);

module.exports = router;