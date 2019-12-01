const getConfirmedTimeEntries = require('./getConfirmedTimeEntries');
const confirmWeek = require('./confirmWeek');
const getProjects = require('./getProjects');
const getCustomers = require('./getCustomers');
const getEvents = require('./getEvents');
const unconfirmWeek = require('./unconfirmWeek');
const createProject = require('./createProject');
const getWeeks = require('./getWeeks');

module.exports = {
    Query: {
        getConfirmedTimeEntries,
        getProjects,
        getCustomers,
        getEvents,
        getWeeks,
    },
    Mutation: {
        confirmWeek,
        unconfirmWeek,
        createProject,
    }
};