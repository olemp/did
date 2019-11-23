var graph = require('@microsoft/microsoft-graph-client');
const moment = require('moment');

module.exports = {
  getUserDetails: async function (accessToken) {
    const user = await getAuthenticatedClient(accessToken).api('/me').get();
    return user;
  },

  getCalendarView: async function (accessToken, startOfWeek) {
    const events = await getAuthenticatedClient(accessToken)
      .api('/me/calendar/calendarView')
      .query({
        startDateTime: moment(startOfWeek).toISOString(),
        endDateTime: moment(startOfWeek).add(7, 'days').toISOString(),
      })
      .select('subject,body,start,end,webLink')
      .orderby('createdDateTime ASC')
      .get();

    return events.value.map(event => ({
      subject: event.subject,
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