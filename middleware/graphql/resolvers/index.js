const getConfirmedTimeEntries = require('./getConfirmedTimeEntries');
const confirmWeek = require('./confirmWeek');
const getProjects = require('./getProjects');
const getCustomers = require('./getCustomers');
const getEvents = require('./getEvents');
const unconfirmWeek = require('./unconfirmWeek');
const createProject = require('./createProject');

module.exports = {
    Query: {
        getConfirmedTimeEntries,
        getProjects,
        getCustomers,
        getEvents,
    },
    Mutation: {
        confirmWeek,
        unconfirmWeek,
        createProject,
    }
};