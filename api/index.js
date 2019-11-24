const express = require('express');
const router = express.Router();
const tokens = require('../tokens');
const graph = require('./graph');
const { TableQuery, TableUtilities } = require('azure-storage');
const table = require('./table');
const entGen = TableUtilities.entityGenerator;
const moment = require('moment');
const uuidv1 = require('uuid/v1');

/**
 * GET /customers
 */
router.get('/customers', async function (req, res) {
  const partitionKey = tokens.getTenantId(req);
  const result = (await table.query(
    'Customers',
    new TableQuery().top(50).where('PartitionKey eq ?', partitionKey).select('CustomerKey', 'Name'),
  ));
  const customers = result.map(r => ({
    key: r.CustomerKey._,
    name: r.Name._,
  }));
  res.json(customers);
});

/**
 * POST /customers
 */
router.post('/customers', async function (req, res) {
  const partitionKey = tokens.getTenantId(req);
  const customer = req.body;
  try {
    await table.add('Customers', {
      PartitionKey: entGen.String(partitionKey),
      RowKey: entGen.String(uuidv1()),
      CustomerKey: entGen.String(customer.key),
      Name: entGen.String(customer.name),
    });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
});

/**
 * GET /projects
 */
router.get('/projects', async function (req, res) {
  const partitionKey = tokens.getTenantId(req);
  const result = (await table.query(
    'Projects',
    new TableQuery().top(50).where('PartitionKey eq ?', partitionKey).select('CustomerKey', 'ProjectKey', 'Name'),
  ));
  const projects = result.map(r => ({
    key: `${r.CustomerKey._} ${r.ProjectKey._}`,
    name: r.Name._,
  }));
  res.json(projects);
});

/**
 * POST /projects
 */
router.post('/projects', async function (req, res) {
  const partitionKey = tokens.getTenantId(req);
  const project = req.body;
  try {
    await table.add('Projects', {
      PartitionKey: entGen.String(partitionKey),
      RowKey: entGen.String(uuidv1()),
      CustomerKey: entGen.String(project.customerKey),
      ProjectKey: entGen.String(project.projectKey),
      Name: entGen.String(project.name),
    });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
});

/**
 * GET /projects/:customerKey
 */
router.get('/projects/:customerKey', async function (req, res) {
  const result = (await table.query(
    'Projects',
    new TableQuery().top(50).where('CustomerKey eq ?', req.params.customerKey).select('CustomerKey', 'ProjectKey', 'Name'),
  ));
  const customers = result.map(r => ({
    key: `${r.CustomerKey._} ${r.ProjectKey._}`,
    name: r.Name._,
  }));
  res.json(customers);
});

/**
 * GET /approved/:projectKey
 */
router.get('/approved/:projectKey', async function (req, res) {
  const result = await table.query(
    'ApprovedTimeEntries',
    new TableQuery().top(50).where('ProjectKey eq ?', req.params.projectKey)
  );
  const entries = result.map(r => ({
    subject: r.Subject._,
    startTime: r.StartTime._,
    endTime: r.EndTime._,
    duration: moment.duration(moment(r.EndTime._).diff(moment(r.StartTime._))).asMinutes(),
  }));
  res.json(entries);
});

/**
 * POST /approve
 */
router.post('/approve', async function (req, res) {
  const partitionKey = tokens.getTenantId(req);
  const events = req.body;
  try {
    for (let i = 0; i < events.length; i++) {
      await table.add('ApprovedTimeEntries', {
        PartitionKey: entGen.String(partitionKey),
        RowKey: entGen.String(events[i].id),
        Subject: entGen.String(events[i].subject),
        StartTime: entGen.DateTime(new Date(events[i].startTime)),
        EndTime: entGen.DateTime(new Date(events[i].endTime)),
        ProjectKey: entGen.String(events[i].project.key),
      });
    }
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
});

/**
 * GET /events/:startOfWeek
 */
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
        const events = calendarView
          .filter(event => !event.isCancelled)
          .filter(event => !event.isAllDay)
          .filter(event => event.subject.indexOf('IGNORE') === -1)
          .filter(event => event.body.indexOf('IGNORE') === -1)
          .filter(event => event.categories.indexOf('IGNORE') === -1)
          .map(e => ({
            ...e,
            duration: moment.duration(moment(e.endTime).diff(moment(e.startTime))).asMinutes(),
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