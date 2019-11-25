const path = require('path');
const graphql = require('express-graphql');
const { importSchema } = require('graphql-import');
const { makeExecutableSchema } = require('graphql-tools');
const { query, parseArray } = require('../../services/table');
const graph = require('../../services/graph');
const { TableQuery } = require('azure-storage');
const utils = require('../../utils');

const typeDefs = importSchema(path.join(__dirname, './schema.graphql'));
const resolvers = {
  Query: {
    /**
     * @resolver projects
     */
    projects: async () => {
      const result = await query(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, new TableQuery().top(1000).select('CustomerKey', 'ProjectKey', 'Name'));
      return parseArray(result).map(r => ({ ...r, key: `${r.customerKey} ${r.projectKey}` }));;;
    },

    /**
     * @resolver customers
     */
    customers: async () => {
      const result = await query(process.env.AZURE_STORAGE_CUSTOMERS_TABLE_NAME, new TableQuery().top(10).select('CustomerKey', 'Name'));
      return parseArray(result).map(r => ({ ...r, key: r.customerKey }));;
    },

    /**
     * @resolver weekView
     * 
     * @arg0 weekNumber
     */
    weekView: async (_obj, args, { user, isAuthenticated }) => {
      if (!isAuthenticated) return [];
      const calendarView = await graph.getCalendarView(user.oauthToken.access_token, args.weekNumber);
      const result = await query(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, new TableQuery().top(1000).where('PartitionKey eq ?', user.profile._json.tid).select('CustomerKey', 'ProjectKey', 'Name'));
      const projects = parseArray(result).map(r => ({ ...r, key: `${r.customerKey} ${r.projectKey}` }));
      const events = calendarView
        .filter(event => event.subject.toUpperCase().indexOf('IGNORE') === -1)
        .filter(event => event.body.toUpperCase().indexOf('IGNORE') === -1)
        .filter(event => event.categories.indexOf('IGNORE') === -1)
        .map(event => {
          let duration = moment.duration(moment(new Date(event.endTime)).diff(moment(new Date(event.startTime)))).asMinutes();
          return {
            id: event.id,
            subject: event.subject,
            webLink: event.webLink,
            startTime: event.startTime,
            endTime: event.endTime,
            duration,
            project: projects.filter(p =>
              event.subject.toUpperCase().indexOf(p.key.toUpperCase()) !== -1
              || event.body.toUpperCase().indexOf(p.key.toUpperCase()) !== -1
              || event.categories.indexOf(p.key) !== -1
            )[0]
          };
        });
      return events;
    },

    /**
     * @resolver customerProjects
     */
    customerProjects: async (_obj, args, { isAuthenticated }) => {
      if (!isAuthenticated) return [];
      const result = await query(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, new TableQuery().top(50).where('CustomerKey eq ?', args.customerKey).select('CustomerKey', 'ProjectKey', 'Name'));
      const projects = parseArray(result).map(r => ({ ...r, key: `${r.customerKey} ${r.projectKey}` }));
      return projects;
    },

    /**
     * @resolver approvedEntries
     * 
     * @arg0 projectKey
     */
    approvedEntries: async (_obj, { projectKey }, { isAuthenticated }) => {
      if (!isAuthenticated) return [];
      let tblQuery = new TableQuery().top(50);
      if (projectKey != '') tblQuery = tblQuery.where('ProjectKey eq ?', projectKey);
      const result = await query(process.env.AZURE_STORAGE_APPROVEDTIMEENTRIES_TABLE_NAME, tblQuery);
      const entries = parseArray(result).map(r => ({
        ...r,
        duration: utils.getDurationMinutes(r.startTime, r.endTime),
      }));
      return entries;
    },
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = graphql((req) => ({
  schema: schema,
  rootValue: root,
  graphiql: req.app.get('env') === 'development',
  context: { user: req.user, isAuthenticated: req.isAuthenticated() }
}));
