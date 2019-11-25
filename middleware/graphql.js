const path = require("path");
const graphql = require("express-graphql");
const { importSchema } = require("graphql-import");
const { makeExecutableSchema } = require("graphql-tools");
const { query, parseArray } = require("../services/table");
const { TableQuery } = require("azure-storage");

const typeDefs = importSchema(path.join(__dirname, "./schema.graphql"));
const resolvers = {
  Query: {

    projects: async () => {
      const result = await query(
        process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME,
        new TableQuery().top(1000).select("CustomerKey", "ProjectKey", "Name")
      );
      return parseArray(result);
    },

    customers: async () => {
      const result = await query(
        process.env.AZURE_STORAGE_CUSTOMERS_TABLE_NAME,
        new TableQuery().top(10).select("CustomerKey", "Name")
      );
      return parseArray(result);
    }

  }
};
const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = graphql({
  schema: schema,
  rootValue: root,
  graphiql: process.env.NODE_ENV === 'development'
});
