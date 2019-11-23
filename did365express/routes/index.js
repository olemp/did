var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  let params = {
    active: { home: true }
  };

  res.render('index', params);
});

router.get('/week_view', function (req, res, next) {
  res.render('week_view');
});

module.exports = router;
