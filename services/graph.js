global.fetch = require("node-fetch");
var graph = require('@microsoft/microsoft-graph-client');
const moment = require('moment');

module.exports = {
  getUserDetails: async function (accessToken) {
    const user = await getAuthenticatedClient(accessToken).api('/me').get();
    return user;
  },

  getCalendarView: async function (accessToken, startOfWeek) {
    const startDateTime = moment(startOfWeek).toISOString();
    const endDateTime = moment(startOfWeek).add(7, 'days').toISOString();
    const { value: events } = await getAuthenticatedClient(accessToken)
      .api('/me/calendar/calendarView')
      .query({ startDateTime, endDateTime })
      .select('id,subject,body,start,end,categories,webLink,isallday,iscancelled')
      .orderby('start/dateTime asc')
      .top(50)
      .get();
    return events.map(event => ({
      id: event.id,
      subject: event.subject,
      body: event.body.content,
      categories: event.categories,
      webLink: event.webLink,
      startTime: event.start.dateTime,
      endTime: event.end.dateTime,
    }));
  }
};

function getAuthenticatedClient(accessToken) {
  const client = graph.Client.init({ authProvider: (done) => { done(null, accessToken); } });
  return client;
}