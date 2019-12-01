const express = require('express');
const router = express.Router()
const isAuthenticated = require('../middleware/passport/isAuthenticated');

router.get('/', function (_req, res) {
  res.render('index', { active: { home: true } });
});

router.get('/week_view', isAuthenticated, (_req, res) => {
  res.render('week_view', { active: { week_view: true } });
});

router.get('/customers', isAuthenticated, (_req, res) => {
  res.render('customers', { active: { customers: true } });
});

router.get('/projects', isAuthenticated, (_req, res) => {
  res.render('projects', { active: { projects: true } });
});

router.get('/admin', isAuthenticated, (_req, res) => {
  res.render('admin', { active: { admin: true } });
});

router.get('/admin/users/:userId', isAuthenticated, (req, res) => {
  res.render('admin-user', { active: { admin: true }, props: JSON.stringify(req.params) });
});

module.exports = router;
