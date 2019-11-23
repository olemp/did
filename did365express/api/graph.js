var graph = require('@microsoft/microsoft-graph-client');

module.exports = {
  getUserDetails: async function (accessToken) {
    const user = await getAuthenticatedClient(accessToken).api('/me').get();
    return user;
  },

  getEvents: async function (accessToken) {
    const events = await getAuthenticatedClient(accessToken)
      .api('/me/events')
      .select('subject,organizer,start,end')
      .orderby('createdDateTime DESC')
      .get();

    return events;
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