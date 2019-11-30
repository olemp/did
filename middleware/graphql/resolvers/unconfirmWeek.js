const { TableBatch } = require('azure-storage');
const { executeBatch } = require('../../../utils/table');
const log = require('debug')('middleware/graphql/unconfirmWeek');

async function unconfirmWeek(_obj, args, context) {
    try {
        const entries = await context.services.storage.getConfirmedTimeEntries(context.user.profile.oid, args.weekNumber, null, { noParse: true });
        if (entries.length == 0) {
            return { success: false, error: 'No confirmed time entries to unconfirm' };
        }
        log('Unconfirming week %s with %s confirmed time entries', args.weekNumber, entries.length);
        const batch = result.reduce((b, entity) => {
            b.deleteEntity(entity);
            return b;
        }, new TableBatch());
        await executeBatch(process.env.AZURE_STORAGE_CONFIRMEDTIMEENTRIES_TABLE_NAME, batch)
        return { success: true, error: null };
    } catch (error) {
        console.log(error);
        return { success: false, error: 'An error occured' };
    }
};

module.exports = unconfirmWeek;