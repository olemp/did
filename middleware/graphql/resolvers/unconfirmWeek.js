const { TableBatch } = require('azure-storage');
const {
    executeBatch,
    queryTable,
    intFilter,
    stringFilter,
    isEqual,
    and,
    combine,
    createQuery,
} = require('../../../services/table');

module.exports = async (_obj, args, context) => {
    let filter = stringFilter('PartitionKey', isEqual, context.user.profile._json.tid);
    filter = combine(filter, and, intFilter('WeekNumber', isEqual, args.weekNumber));
    filter = combine(filter, and, stringFilter('ResourceId', isEqual, context.user.profile.oid));
    const query = createQuery(100, ['PartitionKey', 'RowKey']).where(filter);
    const result = await queryTable(process.env.AZURE_STORAGE_CONFIRMEDTIMEENTRIES_TABLE_NAME, query);
    const batch = result.reduce((b, entity) => {
        b.deleteEntity(entity);
        return b;
    }, new TableBatch());
    await executeBatch(process.env.AZURE_STORAGE_CONFIRMEDTIMEENTRIES_TABLE_NAME, batch)
    return true;
};