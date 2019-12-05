const confirmedTimeEntries = require('./confirmedTimeEntries');
const confirmWeek = require('./confirmWeek');
const projects = require('./projects');
const customers = require('./customers');
const eventData = require('./eventData');
const unconfirmWeek = require('./unconfirmWeek');
const createProject = require('./createProject');
const weeks = require('./weeks');
const users = require('./users');
const updateWeek = require('./updateWeek');

module.exports = {
    Query: {
        confirmedTimeEntries,
        projects,
        customers,
        eventData,
        weeks,
        users,
    },
    Mutation: {
        confirmWeek,
        unconfirmWeek,
        createProject,
        updateWeek,
    }
};