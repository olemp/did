const path = require('path');
const graphql = require('express-graphql');
const { importSchema } = require('graphql-import');
const { makeExecutableSchema } = require('graphql-tools');

const schema = makeExecutableSchema({
  typeDefs: importSchema(path.join(__dirname, './schema.graphql')),
  resolvers: require('./resolvers'),
});

module.exports = graphql((req) => ({
  schema: schema,
  rootValue: global,
  graphiql: process.env.GRAPHIQL_ENABLED == '1',
  pretty: req.app.get('env') === 'development',
  context: {
    user: req.user,
    tid: req.user.profile._json.tid,
    isAuthenticated: req.isAuthenticated(),
  }
}));
