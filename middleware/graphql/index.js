const path = require('path');
const graphql = require('express-graphql');
const { importSchema } = require('graphql-import');
const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const schema = makeExecutableSchema({
  typeDefs: importSchema(path.join(__dirname, './schema.graphql')),
  resolvers: {
    Query: {
      confirmedEntries: resolvers.confirmedEntries,
      customerProjects: resolvers.customerProjects,
      customers: resolvers.customers,
      projects: resolvers.projects,
      weekView: resolvers.weekView,
      isWeekConfirmed: resolvers.isWeekConfirmed,
      confirmedHours: resolvers.confirmedHours,
      confirmedMinutes: resolvers.confirmedMinutes,
    },
    Mutation: {
      confirmWeek: resolvers.confirmWeek,
      unconfirmWeek: resolvers.unconfirmWeek,
    }
  },
});

module.exports = graphql((req) => ({
  schema: schema,
  rootValue: root,
  graphiql: req.app.get('env') === 'development',
  context: {
    user: req.user,
    tid: req.user.profile._json.tid,
    isAuthenticated: req.isAuthenticated(),
  }
}));
