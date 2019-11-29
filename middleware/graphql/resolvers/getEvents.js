const { queryTable, parseArray, createQuery } = require('../../../services/table');
const GraphService = require('../../../services/graph');
const getConfirmedDuration = require('./getConfirmedDuration');
const _ = require('underscore');
const findBestMatch = require('string-similarity').findBestMatch;


/**
 * Get project best match
 * 
 * @param {*} projects 
 * @param {*} customer 
 * @param {*} projectKey 
 * @param {*} minRating 
 */
function getProjectSuggestion(projects, customer, projectKey, minRating = 0) {
    let customerProjects = projects.filter(p => p.customerKey === customer.key);
    let projectKeys = customerProjects.map(p => p.projectKey.toUpperCase());
    let sm = findBestMatch(projectKey, projectKeys);
    let bestMatch = (sm.bestMatch && sm.bestMatch.rating > minRating) ? sm.bestMatch.target : null;
    return bestMatch ? customerProjects.filter(p => p.projectKey === bestMatch)[0] : null;
}

/**
 * Find match
 * 
 * @param {*} content 
 */
function findMatch(content) {
    const regex = /[\(\{\[]((?<customerKey>[A-Za-z0-9]*?)\s(?<projectKey>[A-Za-z0-9]*?))[\)\]\}]/gm;
    const match = regex.exec(content);
    return match ? match.groups : null;
}

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
    let match = findMatch(content);
    if (match) {
        evt.project = projects.filter(p => _.isMatch(p, match))[0];
        evt.customer = customers.filter(c => c.key === match.customerKey)[0];
    } else {
        evt.project = projects.filter(p => content.indexOf(p.key) !== -1)[0];
        if (evt.project) evt.customer = customers.filter(c => c.key === evt.project.key.split(' ')[0])[0];
    }
    if (evt.customer) {
        evt.suggestedProject = !evt.project && getProjectSuggestion(projects, evt.customer, match.projectKey);
    }
    return {
        ...evt,
        ...(match || {}),
        overtime: categories.indexOf('OVERTIME') !== -1,
    };
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