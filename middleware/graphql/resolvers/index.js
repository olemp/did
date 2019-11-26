const confirmedEntries = require('./confirmedEntries');
const confirmWeek = require('./confirmWeek');
const customerProjects = require('./customerProjects');
const customers = require('./customers');
const projects = require('./projects');
const weekView = require('./weekView');
const isWeekConfirmed = require('./isWeekConfirmed');
const confirmedHours = require('./confirmedHours');
const confirmedMinutes = require('./confirmedMinutes');
const unconfirmWeek = require('./unconfirmWeek');

module.exports = {
    confirmedEntries,
    confirmWeek,
    unconfirmWeek,
    customerProjects,
    customers,
    projects,
    weekView,
    isWeekConfirmed,
    confirmedHours,
    confirmedMinutes,
};