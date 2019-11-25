var express = require('express');
var router = express.Router();

router.get('/', function (_req, res) {
  res.render('index', { active: { home: true } });
});

router.get('/week_view', function (req, res) {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('week_view', { active: { week_view: true } });
});

router.get('/customers', function (req, res) {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('customers', { active: { customers: true } });
});

router.get('/projects', function (req, res) {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('projects', { active: { projects: true } });
});

router.get('/reports', function (req, res) {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('reports', { active: { projects: true } });
});

module.exports = router;
