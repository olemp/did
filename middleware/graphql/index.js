const path = require('path');
const graphql = require('express-graphql');
const { importSchema } = require('graphql-import');
const { makeExecutableSchema } = require('graphql-tools');
const { addEntity, queryTable, parseArray } = require('../../services/table');
const graph = require('../../services/graph');
const { TableQuery, TableUtilities } = require('azure-storage');
const utils = require('../../utils');
const entGen = TableUtilities.entityGenerator;

const typeDefs = importSchema(path.join(__dirname, './schema.graphql'));
const resolvers = {
  Query: {
    /**
     * @resolver projects
     */
    projects: async () => {
      const result = await queryTable(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, new TableQuery().top(1000).select('RowKey', 'CustomerKey', 'ProjectKey', 'Name'));
      return parseArray(result).map(r => ({ ...r, key: `${r.customerKey} ${r.projectKey}` }));
    },

    /**
     * @resolver customers
     */
    customers: async () => {
      const result = await queryTable(process.env.AZURE_STORAGE_CUSTOMERS_TABLE_NAME, new TableQuery().top(10).select('RowKey', 'CustomerKey', 'Name'));
      return parseArray(result).map(r => ({ ...r, key: r.customerKey }));;
    },

    /**
     * @resolver weekView
     * 
     * @arg0 weekNumber
     */
    weekView: async (_obj, { weekNumber }, { user, isAuthenticated }) => {
      if (!isAuthenticated) return [];
      const calendarView = await graph.getCalendarView(user.oauthToken.access_token, weekNumber);
      const result = await queryTable(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, new TableQuery().top(1000).where('PartitionKey eq ?', user.profile._json.tid).select('CustomerKey', 'ProjectKey', 'Name'));
      const projects = parseArray(result).map(r => ({ ...r, key: `${r.customerKey} ${r.projectKey}` }));
      const events = calendarView
        .filter(event => event.subject.toUpperCase().indexOf('IGNORE') === -1)
        .filter(event => event.body.toUpperCase().indexOf('IGNORE') === -1)
        .filter(event => event.categories.indexOf('IGNORE') === -1)
        .map(event => {
          let duration = utils.getDurationMinutes(event.startTime, event.endTime);
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
      const result = await queryTable(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, new TableQuery().top(50).where('CustomerKey eq ?', args.customerKey).select('CustomerKey', 'ProjectKey', 'Name'));
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
      let query = new TableQuery().top(50);
      if (projectKey != '') query = query.where('ProjectKey eq ?', projectKey);
      const result = await queryTable(process.env.AZURE_STORAGE_APPROVEDTIMEENTRIES_TABLE_NAME, query);
      const entries = parseArray(result).map(entry => ({
        ...entry,
        duration: utils.getDurationMinutes(entry.startTime, entry.endTime),
      }));
      return entries;
    },
  },
  Mutation: {
    /**
     * @resolver approveWeek
     * 
     * @arg0 entries
     * @arg1 weekNumber
     */
    approveWeek: async (_obj, { entries, weekNumber }, { user, tid, isAuthenticated }) => {
      if (!isAuthenticated) return false;
      const calendarView = await graph.getCalendarView(user.oauthToken.access_token, weekNumber);
      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        let event = calendarView.filter(e => e.id === entry.id)[0];
        let [customerKey, projectKey] = entry.projectKey.split(' ');
        await addEntity(process.env.AZURE_STORAGE_APPROVEDTIMEENTRIES_TABLE_NAME, {
          PartitionKey: entGen.String(tid),
          RowKey: entGen.String(entry.id),
          Subject: entGen.String(event.subject),
          Description: entGen.String(event.body),
          StartTime: entGen.DateTime(new Date(event.startTime)),
          EndTime: entGen.DateTime(new Date(event.endTime)),
          CustomerKey: entGen.String(customerKey),
          ProjectKey: entGen.String(projectKey),
          WebLink: entGen.String(event.webLink),
          WeekNumber: entGen.Int32(weekNumber),
          YearNumber: entGen.Int32(utils.getYear()),
        });
      }
      return true;
    },
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

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
