const express = require('express');
const router = express.Router();
const tokens = require('../tokens');
const graph = require('./graph');
const { TableQuery } = require('azure-storage');
const table = require('./table');

router.get('/customers', async function (req, res) {
  const result = (await table.query(
    'Customers',
    new TableQuery().top(50).where('PartitionKey eq ?', 'Default').select('CustomerKey', 'Name'),
  ));
  const customers = result.map(r => ({
    key: r.CustomerKey,
    name: r.Name._,
  }));
  res.json(customers);
});

router.get('/projects', async function (req, res) {
  const result = (await table.query(
    'Projects',
    new TableQuery().top(50).where('PartitionKey eq ?', 'Default').select('CustomerKey', 'ProjectKey', 'Name'),
  ));
  const projects = result.map(r => ({
    key: `${r.CustomerKey._} ${r.ProjectKey._}`,
    name: r.Name._,
  }));
  res.json(projects);
});

router.get('/events/:startOfWeek', async function (req, res) {
  if (!req.isAuthenticated()) {
    res.json({ error: 'You are not authenticated.' })
  } else {
    let accessToken;
    try {
      accessToken = await tokens.getAccessToken(req);
    } catch (err) {
      res.json({ error: 'Failed to retrieve access token.' })
    }

    if (accessToken && accessToken.length > 0) {
      try {
        const calendarView = await graph.getCalendarView(accessToken, req.params.startOfWeek);
        const result = (await table.query(
          'Projects',
          new TableQuery().top(50).where('PartitionKey eq ?', 'Default').select('CustomerKey', 'ProjectKey', 'Name'),
        ));
        const projects = result.map(r => ({
          key: `${r.CustomerKey._} ${r.ProjectKey._}`,
          name: r.Name._,
        }));
        const events = calendarView.map(e => ({
          ...e,
          project: projects.filter(p =>
            e.subject.indexOf(p.key) !== -1
            || e.body.indexOf(p.key) !== -1
            || e.categories.indexOf(p.key) !== -1
          )[0]
        }));
        res.json(events)
      } catch (error) {
        console.log(error);
        res.json({ error })
      }
    }
  }
});

module.exports = router;