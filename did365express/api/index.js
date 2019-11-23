const express = require('express');
const router = express.Router();
const tokens = require('../tokens');
const graph = require('./graph');
const { TableQuery } = require('azure-storage');
const table = require('./table');

router.get('/customers', async function (req, res) {
  var query = new TableQuery().top(5).where('PartitionKey eq ?', 'Default').select('CustomerKey', 'Name');
  var result = await table.query('Customers', query);
  res.json(result);
});

router.get('/projects', async function (req, res) {
  var query = new TableQuery().top(5).where('PartitionKey eq ?', 'Default').select('CustomerKey', 'ProjectKey', 'Name');
  var result = await table.query('Projects', query);
  res.json(result);
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
        const projects = await table.query('Projects', new TableQuery().top(50).where('PartitionKey eq ?', 'Default').select('CustomerKey', 'ProjectKey', 'Name'));

        res.json(events)
      } catch (error) {
        console.log(error);
        res.json({ error })
      }
    }
  }
});

module.exports = router;