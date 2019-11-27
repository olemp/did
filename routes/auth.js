var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET auth callback. */
router.get('/signin',
  function (req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        prompt: process.env.OAUTH_SIGNIN_PROMPT,
        failureRedirect: '/',
        failureFlash: true
      }
    )(req, res, next);
  },
  function (_req, res) {
    res.redirect('/');
  }
);

router.post('/callback',
  function (req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        failureRedirect: '/',
        failureFlash: true
      }
    )(req, res, next);
  },
  function (_req, res) {
    res.redirect('/');
  }
);

router.get('/signout',
  function (req, res) {
    req.session.destroy(function (_err) {
      req.logout();
      res.redirect('/');
    });
  }
);

module.exports = router;