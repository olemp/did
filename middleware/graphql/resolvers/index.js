const confirmedEntries = require('./confirmedEntries');
const confirmWeek = require('./confirmWeek');
const getProjects = require('./getProjects');
const getCustomers = require('./getCustomers');
const getEvents = require('./getEvents');
const confirmedHours = require('./confirmedHours');
const unconfirmWeek = require('./unconfirmWeek');

module.exports = {
    Query: {
        confirmedEntries,
        getProjects,
        getCustomers,
        getEvents,
        confirmedHours,
    },
    Mutation: {
        confirmWeek,
        unconfirmWeek,
    }
};