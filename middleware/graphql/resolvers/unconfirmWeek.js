const { TableUtilities, TableBatch } = require('azure-storage');
const entGen = TableUtilities.entityGenerator;
const { executeBatch } = require('../../../services/table');
const utils = require('../../../utils');

module.exports = async (_obj, { entries, weekNumber }, { user, tid, isAuthenticated }) => {
    if (!isAuthenticated) return false;
    // TODO: Add partion key filter
    var filter1 = TableQuery.int32Filter('WeekNumber', TableUtilities.QueryComparisons.EQUAL, args.weekNumber);
    var filter2 = TableQuery.stringFilter('ResourceId', TableUtilities.QueryComparisons.EQUAL, context.user.profile.oid);
    var combinedFilters = TableQuery.combineFilters(filter1, TableUtilities.TableOperators.AND, filter2);
    const query = new TableQuery().where(combinedFilters).top(100).select('RowKey');
    const result = await queryTable(process.env.AZURE_STORAGE_CONFIRMEDTIMEENTRIES_TABLE_NAME, query);
    const batch = new TableBatch();
    result.forEach(entity => {
        batch.deleteEntity(entity);
    });
    await executeBatch(process.env.AZURE_STORAGE_CONFIRMEDTIMEENTRIES_TABLE_NAME, batch)
    return true;
};