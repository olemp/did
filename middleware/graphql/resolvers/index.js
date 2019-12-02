const getConfirmedTimeEntries = require('./getConfirmedTimeEntries');
const confirmWeek = require('./confirmWeek');
const getProjects = require('./getProjects');
const getCustomers = require('./getCustomers');
const getEventData = require('./getEventData');
const unconfirmWeek = require('./unconfirmWeek');
const createProject = require('./createProject');
const getWeeks = require('./getWeeks');
const getUsers = require('./getUsers');
const updateWeek = require('./updateWeek');

module.exports = {
    Query: {
        getConfirmedTimeEntries,
        getProjects,
        getCustomers,
        getEventData,
        getWeeks,
        getUsers,
    },
    Mutation: {
        confirmWeek,
        unconfirmWeek,
        createProject,
        updateWeek,
    }
};