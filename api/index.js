const express = require('express');
const router = express.Router();
const table = require('../services/table');
const { TableUtilities } = require('azure-storage');
const entGen = TableUtilities.entityGenerator;

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

module.exports = router;