const _ = require('underscore');
const findBestMatch = require('string-similarity').findBestMatch;
const log = require('debug')('middleware/graphql/getEventData');

/**
 * Get project best match
 * 
 * @param {*} projects 
 * @param {*} customer 
 * @param {*} projectKey 
 */
function getProjectSuggestion(projects, customer, projectKey) {
    log('Finding best match for [%s]', projectKey);
    let customerProjects = projects.filter(p => p.customerKey === customer.key);
    let projectKeys = customerProjects.map(p => p.projectKey);
    let sm = findBestMatch(projectKey, projectKeys);
    let target = (sm.bestMatch && sm.bestMatch.rating > 0) ? sm.bestMatch.target : null;
    if (!target) return null;
    let suggestion = customerProjects.filter(p => p.projectKey === target.toUpperCase())[0];
    log('Project [%s] is best match for [%s]', suggestion.projectKey, projectKey);
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
    log('Finding match for [%s]', evt.title);
    let categories = evt.categories.join(' ').toUpperCase();
    let content = [evt.title, evt.body, categories].join(' ').toUpperCase();
    let match = findMatch(content, categories);
    if (match) {
        log('Found match for [%s]: %s', evt.title, JSON.stringify(match));
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


/**
 * 
 * @param {*} _obj Unused obj
 * @param {*} args Args (weekNumber)
 * @param {*} context The context
 */
async function getEventData(_obj, args, context) {
    log('Retrieving events for week %s', args.weekNumber);
    let [projects, customers, confirmedTimeEntries] = await Promise.all([
        context.services.storage.getProjects(),
        context.services.storage.getCustomers(),
        context.services.storage.getConfirmedTimeEntries(context.user.profile.oid, args.weekNumber),
    ]);
    let events = [];
    let matchedEvents = [];
    let matchedDuration = 0;
    let confirmedDuration = 0;
    if (confirmedTimeEntries.length > 0) {
        log('Found confirmed events for week %s, retrieving entries from storage', args.weekNumber);
        events = confirmedTimeEntries.map(entry => ({
            ...entry,
            project: _.find(projects, p => p.projectKey === entry.projectKey),
            customer: _.find(customers, p => p.customerKey === entry.customerKey),
        }));
        matchedEvents = events;
        confirmedDuration = events.reduce((sum, evt) => sum + evt.durationMinutes, 0);
        matchedDuration = confirmedDuration;
    } else {
        log('Found no confirmed events for week %s, retrieving entries from Microsoft Graph', args.weekNumber);
        events = await context.services.graph.getEvents(args.weekNumber);
        events = events.map(evt => matchEvent(evt, projects, customers));
        matchedEvents = events.filter(evt => (evt.project && evt.project.id));
        matchedDuration = matchedEvents.reduce((sum, evt) => sum + evt.durationMinutes, 0);
    }
    return {
        weekNumber: args.weekNumber,
        events,
        totalDuration: events.reduce((sum, evt) => sum + evt.durationMinutes, 0),
        matchedDuration,
        matchedEvents,
        confirmedDuration,
    };
};

module.exports = getEventData;