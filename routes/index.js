var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', { active: { home: true } });
});

router.get('/week_view', function (req, res, next) {
  res.render('week_view', { active: { week_view: true } });
});

router.get('/customers', function (req, res, next) {
  res.render('customers', { active: { customers: true } });
});

router.get('/projects', function (req, res, next) {
  res.render('projects', { active: { projects: true } });
});

module.exports = router;
