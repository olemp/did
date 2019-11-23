const express = require('express');
const passport = require('passport');
const router = express.Router();

/* GET auth callback. */
router.get('/signin',
    (request, response, next) => {
        passport.authenticate('azuread-openidconnect',
            {
                responseponse: response,
                prompt: 'login',
                failureRedirect: '/',
                failureFlash: true
            },
        )(request, response, next);
    },
    (request, response) => {
        response.redirect('/');
    }
);

router.post('/callback',
    (request, response, next) => {
        console.log(response);
        passport.authenticate('azuread-openidconnect',
            {
                response,
                failureRedirect: '/',
                failureFlash: true
            }
        )(request, response, next);
    },
    (request, response) => {
        response.redirect('/');
    }
);

router.get('/signout',
    (request, response) => {
        request.session.destroy(function (err) {
            request.logout();
            response.redirect('/');
        });
    }
);

module.exports = router;