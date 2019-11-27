const { TableUtilities, TableBatch, TableQuery } = require('azure-storage');
const { executeBatch, queryTable } = require('../../../services/table');

module.exports = async (_obj, args, context) => {
    if (!context.isAuthenticated) return false;
    // TODO: Add partion key filter
    var filter1 = TableQuery.int32Filter('WeekNumber', TableUtilities.QueryComparisons.EQUAL, args.weekNumber);
    var filter2 = TableQuery.stringFilter('ResourceId', TableUtilities.QueryComparisons.EQUAL, context.user.profile.oid);
    var combinedFilters = TableQuery.combineFilters(filter1, TableUtilities.TableOperators.AND, filter2);
    const query = new TableQuery().where(combinedFilters).top(100).select('PartitionKey', 'RowKey');
    const result = await queryTable(process.env.AZURE_STORAGE_CONFIRMEDTIMEENTRIES_TABLE_NAME, query);
    const batch = result.reduce((b, entity) => {
        b.deleteEntity(entity);
        return b;
    }, new TableBatch());
    await executeBatch(process.env.AZURE_STORAGE_CONFIRMEDTIMEENTRIES_TABLE_NAME, batch)
    return true;
};