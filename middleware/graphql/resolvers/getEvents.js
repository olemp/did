const { queryTable, parseArray, createQuery } = require('../../../services/table');
const GraphService = require('../../../services/graph');
const _ = require('underscore');

const PROJECT_MATCH_REGEX = /[\(\{\[]((?<customerKey>.*?)\s(?<projectKey>.*?))[\)\]\}]/gm;

/**
 * Checks for project match in event
 * 
 * @param {*} evt 
 * @param {*} projects 
 * @param {*} customers 
 */
function matchEvent(evt, projects, customers) {
    let content = [evt.title, evt.body, JSON.stringify(evt.categories)].join(' ').toUpperCase();
    let project;
    let customer;
    let match = (PROJECT_MATCH_REGEX.exec(content) || {}).groups;
    if (match) {
        project = projects.filter(p => _.isMatch(p, match))[0];
        customer = customers.filter(c => c.key === match.customerKey)[0];
    } else {
        project = projects.filter(p => content.indexOf(p.key) !== -1)[0];
        if (project) customer = customers.filter(c => c.key === project.key.split(' ')[0])[0];
    }
    if (project) {
        evt.project = project;
    }
    if (customer) {
        evt.customer = customer;
    }
    return { ...evt, ...(match || {}) };
}

async function getEvents(_obj, args, context) {
    let events = await new GraphService(context.user.oauthToken.access_token).getEvents(args.weekNumber);
    const query = createQuery(1000).where('PartitionKey eq ?', context.tid);
    const result = await Promise.all([
        queryTable(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, query),
        queryTable(process.env.AZURE_STORAGE_CUSTOMERS_TABLE_NAME, query),
    ])
    const projects = parseArray(result[0]).map(r => ({ ...r, key: `${r.customerKey} ${r.projectKey}`.toUpperCase() }));
    const customers = parseArray(result[1]).map(r => ({ ...r, key: r.customerKey.toUpperCase() }));;
    events = events.map(evt => matchEvent(evt, projects, customers));
    const totalDuration = events.reduce((sum, evt) => sum + evt.durationMinutes, 0);
    const matchedDuration = events.filter(evt => (evt.project && evt.project.id)).reduce((sum, evt) => sum + evt.durationMinutes, 0);
    return {
        weekNumber: args.weekNumber,
        events,
        totalDuration,
        matchedDuration,
    };
};

module.exports = getEvents;