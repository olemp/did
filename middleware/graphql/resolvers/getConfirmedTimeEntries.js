const StorageService = require('../../../services/storage');
const log = require('debug')('middleware/graphql/getConfirmedTimeEntries');

async function getConfirmedTimeEntries(_obj, args, context) {
    const confirmedTimeEntries = await new StorageService(context.tid).getConfirmedTimeEntries(args.projectKey, args.resourceId);
    log('Retrieved %s confirmed time entries from storage', confirmedTimeEntries.length);
    return confirmedTimeEntries;
};

module.exports = getConfirmedTimeEntries;