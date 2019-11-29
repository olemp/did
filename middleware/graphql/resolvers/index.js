const getConfirmedEntries = require('./getConfirmedEntries');
const confirmWeek = require('./confirmWeek');
const getProjects = require('./getProjects');
const getCustomers = require('./getCustomers');
const getEvents = require('./getEvents');
const getConfirmedDuration = require('./getConfirmedDuration');
const unconfirmWeek = require('./unconfirmWeek');

module.exports = {
    Query: {
        getConfirmedEntries,
        getProjects,
        getCustomers,
        getEvents,
        getConfirmedDuration,
    },
    Mutation: {
        confirmWeek,
        unconfirmWeek,
    }
};