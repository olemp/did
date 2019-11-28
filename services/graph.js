global.fetch = require("node-fetch");
const moment = require('moment');
const stripHtml = require("string-strip-html");
const utils = require('../utils');

function GraphService(accessToken) {
  this.accessToken = accessToken;
}

/**
 * Renoves ignored events from the collection
 * 
 * @param {*} events 
 */
GraphService.prototype.removeIgnoredEvents = function (events) {
  return events.filter(evt => {
    let content = [evt.title, evt.body, JSON.stringify(evt.categories)].join(' ').toUpperCase();
    return content.indexOf('IGNORE') === -1;
  });
}

/**
 * Gets a Microsoft Graph Client using the auth token from the class
 */
GraphService.prototype.getClient = function () {
  const client = require('@microsoft/microsoft-graph-client').Client.init({ authProvider: (done) => { done(null, this.accessToken); } });
  return client;
}

/**
 * Get user details for the current user
 */
GraphService.prototype.getUserDetails = async function () {
  const user = await this.getClient().api('/me').get();
  return user;
};

/**
 * Get events for the specified week
 * 
 * @todo Add support for month number etc
 * 
 * @param {*} weekNumber 
 */
GraphService.prototype.getEvents = async function (weekNumber) {
  const startOfWeek = moment().year(moment().year()).week(weekNumber).startOf('isoWeek');
  const startDateTime = startOfWeek.toISOString();
  const endDateTime = startOfWeek.endOf('week').toISOString();
  const { value } = await this.getClient()
    .api('/me/calendar/calendarView')
    .query({ startDateTime, endDateTime })
    .select('id,subject,body,start,end,lastModifiedDateTime,categories,webLink')
    .filter(`sensitivity ne 'private' and isallday eq false and iscancelled eq false`)
    .orderby('start/dateTime asc')
    .top(50)
    .get();
  let events = value.map(evt => ({
    id: evt.id,
    title: evt.subject,
    body: stripHtml(evt.body.content),
    categories: evt.categories,
    webLink: evt.webLink,
    lastModifiedDateTime: evt.lastModifiedDateTime,
    startTime: evt.start.dateTime,
    endTime: evt.end.dateTime,
    durationHours: utils.getDurationHours(evt.start.dateTime, evt.end.dateTime),
    durationMinutes: utils.getDurationMinutes(evt.start.dateTime, evt.end.dateTime),
  }));
  events = this.removeIgnoredEvents(events);
  return events;
};


module.exports = GraphService;