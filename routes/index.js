var express = require('express');
var router = express.Router();

router.get('/', (_req, res) => {
  res.render('index', { active: { home: true } });
});

router.get('/week_view', (_req, res) => {
  res.render('week_view', { active: { week_view: true } });
});

router.get('/customers', (_req, res) => {
  res.render('customers', { active: { customers: true } });
});

router.get('/projects', (_req, res) => {
  res.render('projects', { active: { projects: true } });
});

module.exports = router;
