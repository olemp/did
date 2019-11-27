const { queryTable, parseArray } = require('../../../services/table');
const { TableQuery } = require('azure-storage');
const graph = require('../../../services/graph');
/**
 * Checks for project match in event
 * 
 * @param {*} event 
 * @param {*} projectKey 
 */
function matchProject(event, projectKey) {
    return event.title.toUpperCase().indexOf(projectKey.toUpperCase()) !== -1
        || event.body.toUpperCase().indexOf(projectKey.toUpperCase()) !== -1
        || JSON.stringify(event.categories).toUpperCase().indexOf(projectKey) !== -1
}

module.exports = async (_obj, args, context) => {
    if (!context.isAuthenticated) return [];
    const calendarView = await graph.getCalendarView(context.user.oauthToken.access_token, args.weekNumber);
    const result = await queryTable(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, new TableQuery().top(1000).where('PartitionKey eq ?', context.user.profile._json.tid).select('CustomerKey', 'ProjectKey', 'Name'));
    const projects = parseArray(result).map(r => ({ ...r, key: `${r.customerKey} ${r.projectKey}` }));
    const events = calendarView.map(event => {
        let project = projects.filter(p => matchProject(event, p.key))[0];
        return { ...event, project };
    });
    const totalDuration = events.reduce((sum, event) => sum + event.durationMinutes, 0);
    const matchedDuration = events.filter(event => event.project).reduce((sum, event) => sum + event.durationMinutes, 0);
    return { events, totalDuration, matchedDuration };
};