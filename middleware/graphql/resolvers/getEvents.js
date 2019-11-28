const { queryTable, parseArray, createQuery } = require('../../../services/table');
const graphService = require('../../../services/graph');

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

async function getEvents(_obj, args, context) {
    let events = await new graphService(context.user.oauthToken.access_token).getEvents(args.weekNumber);
    const query = createQuery(1000, ['CustomerKey', 'ProjectKey', 'Name']).where('PartitionKey eq ?', context.tid);
    const result = await queryTable(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, query);
    const projects = parseArray(result).map(r => ({ ...r, key: `${r.customerKey} ${r.projectKey}` }));
    events = events.map(evt => {
        let project = projects.filter(p => matchProject(evt, p.key))[0];
        return { ...evt, project };
    });
    const totalDuration = events.reduce((sum, evt) => sum + evt.durationMinutes, 0);
    const matchedDuration = events.filter(evt => evt.project).reduce((sum, evt) => sum + evt.durationMinutes, 0);
    return { weekNumber: args.weekNumber, events, totalDuration, matchedDuration };
};

module.exports = getEvents;