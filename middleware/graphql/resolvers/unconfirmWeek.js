const { TableBatch } = require('azure-storage');
const { executeBatch } = require('../../../utils/table');
const StorageService = require('../../../services/storage');
const log = require('debug')('middleware/graphql/unconfirmWeek');

async function unconfirmWeek(_obj, args, context) {
    const entries = await new StorageService(context.tid).getConfirmedTimeEntries(undefined, context.user.profile.oid, args.weekNumber, { noParse: true });
    if (entries.length == 0) return false;
    log('Unconfirming week %s with %s confirmed time entries', args.weekNumber, entries.length);

    const batch = result.reduce((b, entity) => {
        b.deleteEntity(entity);
        return b;
    }, new TableBatch());
    await executeBatch(process.env.AZURE_STORAGE_CONFIRMEDTIMEENTRIES_TABLE_NAME, batch)
    return true;
};

module.exports = unconfirmWeek;