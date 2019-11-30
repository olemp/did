const getConfirmedDuration = require('./getConfirmedDuration');
const _ = require('underscore');
const findBestMatch = require('string-similarity').findBestMatch;
const StorageService = require('../../../services/storage');
const GraphService = require('../../../services/graph');
const debug = require('debug');


/**
 * Get project best match
 * 
 * @param {*} projects 
 * @param {*} customer 
 * @param {*} projectKey 
 */
function getProjectSuggestion(projects, customer, projectKey) {
    debug('getEvents:getProjectSuggestion')('Finding best match for [%s]', projectKey);
    let customerProjects = projects.filter(p => p.customerKey === customer.key);
    let projectKeys = customerProjects.map(p => p.projectKey);
    let sm = findBestMatch(projectKey, projectKeys);
    let target = (sm.bestMatch && sm.bestMatch.rating > 0) ? sm.bestMatch.target : null;
    if (!target) return null;
    let suggestion = customerProjects.filter(p => p.projectKey === target.toUpperCase())[0];
    debug('getEvents:getProjectSuggestion')('Project [%s] is best match for [%s]', suggestion.projectKey, projectKey);
    return suggestion;
}

/**
 * Find match
 * 
 * First looking in categories, then in
 * 
 * @param {*} content 
 * @param {*} categories 
 */
function findMatch(content, categories) {
    let regex = /((?<customerKey>[A-Za-z0-9]*?)\s(?<projectKey>[A-Za-z0-9]*))/gm;
    let match = regex.exec(categories);
    if (match && match.groups) {
        return match.groups;
    }
    regex = /[\(\{\[]((?<customerKey>[A-Za-z0-9]*?)\s(?<projectKey>[A-Za-z0-9]*?))[\)\]\}]/gm;
    match = regex.exec(content);
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
    debug('getEvents:matchEvent')('Finding match for [%s]', evt.title);
    let categories = evt.categories.join(' ').toUpperCase();
    let content = [evt.title, evt.body, categories].join(' ').toUpperCase();
    let match = findMatch(content, categories);
    if (match) {
        debug('getEvents:matchEvent')('Found match for [%s]: %s', evt.title, JSON.stringify(match));
        evt.project = projects.filter(p => _.isMatch(p, match))[0];
        evt.customer = customers.filter(c => c.key === match.customerKey)[0];
    } else {
        evt.project = projects.filter(p => content.indexOf(p.key) !== -1)[0];
        if (evt.project) {
            evt.customer = customers.filter(c => c.key === evt.project.key.split(' ')[0])[0];
        }
    }
    if (evt.customer && !evt.project) {
        evt.suggestedProject = getProjectSuggestion(projects, evt.customer, match.projectKey);
    }
    return {
        ...evt,
        ...(match || {}),
        overtime: categories.indexOf('OVERTIME') !== -1,
    };
}

async function getEvents(_obj, args, context) {
    debug('getEvents:main')('Retrieving events for week %s', args.weekNumber);
    let [events, projects, customers, confirmedDuration] = await Promise.all([
        new GraphService(context.user.oauthToken.access_token).getEvents(args.weekNumber),
        new StorageService(context.tid).getProjects(),
        new StorageService(context.tid).getCustomers(),
        getConfirmedDuration(null, { weekNumber: args.weekNumber, type: 'DurationMinutes' }, context),
    ])
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