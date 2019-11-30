const log = require('debug')('middleware/graphql/getConfirmedTimeEntries');

async function getConfirmedTimeEntries(_obj, args, context) {
    const confirmedTimeEntries = context.services.storage.getConfirmedTimeEntries(args.resourceId);
    log('Retrieved %s confirmed time entries from storage', confirmedTimeEntries.length);
    return confirmedTimeEntries;
};

module.exports = getConfirmedTimeEntries;