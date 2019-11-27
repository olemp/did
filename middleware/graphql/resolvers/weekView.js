const { queryTable, parseArray } = require('../../../services/table');
const { TableQuery } = require('azure-storage');
const graph = require('../../../services/graph');
/**
 * Checks for project match in event
 * 
 * @param {*} evt 
 * @param {*} projectKey 
 */
function matchProject(evt, projectKey) {
    let content = [evt.title, evt.body, JSON.stringify(evt.categories)].join(' ').toUpperCase();
    return content.indexOf(projectKey.toUpperCase()) !== -1;
}

module.exports = async (_obj, args, context) => {
    if (!context.isAuthenticated) return [];
    const calendarView = await graph.getCalendarView(context.user.oauthToken.access_token, args.weekNumber);
    const result = await queryTable(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, new TableQuery().top(1000).where('PartitionKey eq ?', context.user.profile._json.tid).select('CustomerKey', 'ProjectKey', 'Name'));
    const projects = parseArray(result).map(r => ({ ...r, key: `${r.customerKey} ${r.projectKey}` }));
    const events = calendarView.map(evt => {
        let project = projects.filter(p => matchProject(evt, p.key))[0];
        return { ...evt, project };
    });
    const totalDuration = events.reduce((sum, evt) => sum + evt.durationMinutes, 0);
    const matchedDuration = events.filter(evt => evt.project).reduce((sum, evt) => sum + evt.durationMinutes, 0);
    return { events, totalDuration, matchedDuration };
};