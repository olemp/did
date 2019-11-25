const express = require('express');
const router = express.Router();
const graph = require('../services/graph');
const table = require('../services/table');
const { TableQuery, TableUtilities } = require('azure-storage');
const entGen = TableUtilities.entityGenerator;
const moment = require('moment');
const uuidv1 = require('uuid/v1');

/**
 * POST /customers
 */
router.post('/customers', async function (req, res) {
  const customer = req.body;
  try {
    await table.add(process.env.AZURE_STORAGE_CUSTOMERS_TABLE_NAME, {
      PartitionKey: entGen.String(req.user.profile._json.tid),
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
 * POST /projects
 */
router.post('/projects', async function (req, res) {
  const project = req.body;
  try {
    await table.add(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, {
      PartitionKey: entGen.String(req.user.profile._json.tid),
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
    process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME,
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
    process.env.AZURE_STORAGE_APPROVEDTIMEENTRIES_TABLE_NAME,
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
  const events = req.body;
  try {
    for (let i = 0; i < events.length; i++) {
      await table.add(process.env.AZURE_STORAGE_APPROVEDTIMEENTRIES_TABLE_NAME, {
        PartitionKey: entGen.String(req.user.profile._json.tid),
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
    try {
      const calendarView = await graph.getCalendarView(req.user.oauthToken.access_token, req.params.startOfWeek);
      const result = await table.query(
        process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME,
        new TableQuery().top(1000).where('PartitionKey eq ?', req.user.profile._json.tid).select('CustomerKey', 'ProjectKey', 'Name'),
      );
      const projects = result.map(r => ({
        key: `${r.CustomerKey._} ${r.ProjectKey._}`,
        name: r.Name._,
      }));
      const events = calendarView
        .filter(event => !event.isCancelled)
        .filter(event => !event.isAllDay)
        .filter(event => event.subject.toUpperCase().indexOf('IGNORE') === -1)
        .filter(event => event.body.toUpperCase().indexOf('IGNORE') === -1)
        .filter(event => event.categories.indexOf('IGNORE') === -1)
        .map(e => ({
          id: e.id,
          subject: e.subject,
          webLink: e.webLink,
          startTime: e.startTime,
          endTime: e.endTime,
          duration: moment.duration(moment(e.endTime).diff(moment(e.startTime))).asMinutes(),
          project: projects.filter(p =>
            e.subject.toUpperCase().indexOf(p.key.toUpperCase()) !== -1
            || e.body.toUpperCase().indexOf(p.key.toUpperCase()) !== -1
            || e.categories.indexOf(p.key) !== -1
          )[0]
        }));
      res.json(events)
    } catch (error) {
      res.json({ error })
    }
  }
});

module.exports = router;