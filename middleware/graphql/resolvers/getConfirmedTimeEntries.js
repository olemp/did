const log = require('debug')('middleware/graphql/getConfirmedTimeEntries');

/**
 * Get confirmed time entries
 * 
 * @param {*} _obj Unused object
 * @param {*} args Args (projectKey, resourceId)
 * @param {*} context Context
 * 
 * @returns The entries and their total duration in minutes
 */
async function getConfirmedTimeEntries(_obj, args, context) {
    const entries = await context.services.storage.getConfirmedTimeEntries(args.resourceId, null, args.projectKey);
    log('Retrieved %s confirmed time entries from storage', entries.length);
    const duration = entries.reduce((sum, ent) => sum + ent.durationMinutes, 0);
    return { entries, duration };
};

module.exports = getConfirmedTimeEntries;