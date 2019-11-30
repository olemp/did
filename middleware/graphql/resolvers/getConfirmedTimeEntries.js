const log = require('debug')('middleware/graphql/getConfirmedTimeEntries');

/**
 * Get confirmed time entries
 * 
 * @param {*} _obj Unused object
 * @param {*} args Args (projectKey, resourceId)
 * @param {*} context Context
 */
async function getConfirmedTimeEntries(_obj, args, context) {
    const confirmedTimeEntries = await context.services.storage.getConfirmedTimeEntries(args.resourceId, null, args.projectKey);
    log('Retrieved %s confirmed time entries from storage', confirmedTimeEntries.length);
    return confirmedTimeEntries;
};

module.exports = getConfirmedTimeEntries;