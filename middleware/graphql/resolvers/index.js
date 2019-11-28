const confirmedEntries = require('./confirmedEntries');
const confirmWeek = require('./confirmWeek');
const customerProjects = require('./customerProjects');
const customers = require('./customers');
const projects = require('./projects');
const weekView = require('./weekView');
const isWeekConfirmed = require('./isWeekConfirmed');
const confirmedHours = require('./confirmedHours');
const unconfirmWeek = require('./unconfirmWeek');

module.exports = {
    Query: {
        confirmedEntries,
        customerProjects,
        customers,
        projects,
        weekView,
        isWeekConfirmed,
        confirmedHours,
    },
    Mutation: {
        confirmWeek,
        unconfirmWeek,
    }
};