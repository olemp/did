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
      .select('subject,body,start,end,categories,webLink,isallday,iscancelled')
      .orderby('createdDateTime ASC')
      .top(50)
      .get();
    return events
      .filter(event => !event.isCancelled && !event.isAllDay)
      .map(event => ({
        subject: event.subject,
        body: event.body.content,
        categories: event.categories,
        webLink: event.webLink,
        startTime: event.start.dateTime,
        endTime: event.end.dateTime,
        duration: moment.duration(moment(event.end.dateTime).diff(moment(event.start.dateTime))).asMinutes(),
      }));
  }
};

function getAuthenticatedClient(accessToken) {
  const client = graph.Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  return client;
}