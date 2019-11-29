const { queryTable, parseArray, createQuery } = require('../../../services/table');
const GraphService = require('../../../services/graph');
const _ = require('underscore');

const PROJECT_MATCH_REGEX = /[\(\{\[]((?<customerKey>.*?)\s(?<projectKey>.*?))[\)\]\}]/gm;

/**
 * Checks for project match in event
 * 
 * @param {*} evt 
 * @param {*} projects 
 */
function matchProject(evt, projects) {
    let content = [evt.title, evt.body, JSON.stringify(evt.categories)].join(' ').toUpperCase();
    let project = ((PROJECT_MATCH_REGEX.exec(content) || {}).groups || {});
    project = projects.filter(p => _.isMatch(p, project))[0] || project;
    return { ...evt, project };
}

async function getEvents(_obj, args, context) {
    let events = await new GraphService(context.user.oauthToken.access_token).getEvents(args.weekNumber);
    const query = createQuery(1000).where('PartitionKey eq ?', context.tid);
    const result = await queryTable(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, query);
    const projects = parseArray(result).map(r => ({ ...r, key: `${r.customerKey} ${r.projectKey}` }));
    events = events.map(evt => matchProject(evt, projects));
    const totalDuration = events.reduce((sum, evt) => sum + evt.durationMinutes, 0);
    const matchedDuration = events.filter(evt => evt.project.id).reduce((sum, evt) => sum + evt.durationMinutes, 0);
    return {
        weekNumber: args.weekNumber,
        events,
        totalDuration,
        matchedDuration,
    };
};

module.exports = getEvents;