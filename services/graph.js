global.fetch = require("node-fetch");
const graph = require('@microsoft/microsoft-graph-client');
const moment = require('moment');
const stripHtml = require("string-strip-html");
const utils = require('../utils');

function getAuthenticatedClient(accessToken) {
  const client = graph.Client.init({ authProvider: (done) => { done(null, accessToken); } });
  return client;
}

async function getUserDetails(accessToken) {
  const user = await getAuthenticatedClient(accessToken).api('/me').get();
  return user;
};

async function removeIgnoredEvents(events) {
  let content = [event.title, event.body, JSON.stringify(event.categories)].join(' ').toUpperCase();
  return events.filter(event => content.indexOf('IGNORE') === -1);
}

async function getCalendarView(accessToken, weekNumber) {
  const startOfWeek = moment().year(moment().year()).week(weekNumber).startOf('isoWeek');
  const startDateTime = startOfWeek.toISOString();
  const endDateTime = startOfWeek.endOf('week').toISOString();
  const { value } = await getAuthenticatedClient(accessToken)
    .api('/me/calendar/calendarView')
    .query({ startDateTime, endDateTime })
    .select('id,subject,body,start,end,categories,webLink')
    .filter(`sensitivity ne 'private' and isallday eq false and iscancelled eq false`)
    .orderby('start/dateTime asc')
    .top(50)
    .get();
  let events = value.map(event => ({
    id: event.id,
    title: event.subject,
    body: stripHtml(event.body.content),
    categories: event.categories,
    webLink: event.webLink,
    startTime: event.start.dateTime,
    endTime: event.end.dateTime,
    durationHours: utils.getDurationHours(event.start.dateTime, event.end.dateTime),
    durationMinutes: utils.getDurationMinutes(event.start.dateTime, event.end.dateTime),
  }));
  events = removeIgnoredEvents(events);
  return events;
};

module.exports = {
  getUserDetails: getUserDetails,
  getCalendarView: getCalendarView,
}