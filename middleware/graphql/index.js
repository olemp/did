const path = require('path');
const graphql = require('express-graphql');
const { importSchema } = require('graphql-import');
const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const schema = makeExecutableSchema({
  typeDefs: importSchema(path.join(__dirname, './schema.graphql')),
  resolvers: {
    Query: {
      approvedEntries: resolvers.approvedEntries,
      customerProjects: resolvers.customerProjects,
      customers: resolvers.customers,
      projects: resolvers.projects,
      weekView: resolvers.weekView,
    },
    Mutation: {
      approveWeek: resolvers.approveWeek,
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
