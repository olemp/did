const { queryTable, parseArray, createQuery } = require('../../../services/table');
const GraphService = require('../../../services/graph');
const getConfirmedDuration = require('./getConfirmedDuration');
const _ = require('underscore');

const PROJECT_MATCH_REGEX = /[\(\{\[]((?<customerKey>[A-Za-z0-9]*?)\s(?<projectKey>[A-Za-z0-9]*?))[\)\]\}]/gm;

/**
 * Checks for project match in event
 * 
 * @param {*} evt 
 * @param {*} projects 
 * @param {*} customers 
 */
function matchEvent(evt, projects, customers) {
    let categories = JSON.stringify(evt.categories).toUpperCase();
    let content = [evt.title, evt.body, categories].join(' ').toUpperCase();
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
    return { ...evt, ...(match || {}), overtime: categories.indexOf('OVERTIME') !== -1 };
}

async function getEvents(_obj, args, context) {
    let events = await new GraphService(context.user.oauthToken.access_token).getEvents(args.weekNumber);
    const query = createQuery(1000).where('PartitionKey eq ?', context.tid);
    const [pRes, cRes, confirmedDuration] = await Promise.all([
        queryTable(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, query),
        queryTable(process.env.AZURE_STORAGE_CUSTOMERS_TABLE_NAME, query),
        getConfirmedDuration(null, { weekNumber: args.weekNumber, type: 'DurationMinutes' }, context),
    ])
    const projects = parseArray(pRes).map(r => ({ ...r, key: `${r.customerKey} ${r.projectKey}`.toUpperCase() }));
    const customers = parseArray(cRes).map(r => ({ ...r, key: r.customerKey.toUpperCase() }));;
    events = events.map(evt => matchEvent(evt, projects, customers));
    const totalDuration = events.reduce((sum, evt) => sum + evt.durationMinutes, 0);
    const matchedEvents = events.filter(evt => (evt.project && evt.project.id));
    const matchedDuration = matchedEvents.reduce((sum, evt) => sum + evt.durationMinutes, 0);
    return {
        weekNumber: args.weekNumber,
        events,
        totalDuration,
        matchedDuration,
        matchedEvents,
        confirmedDuration
    };
};

module.exports = getEvents;