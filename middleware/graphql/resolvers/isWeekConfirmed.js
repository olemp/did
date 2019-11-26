const { TableQuery, TableUtilities } = require('azure-storage');
const { queryTable } = require('../../../services/table');

module.exports = async (_obj, args, context) => {
    if (!context.isAuthenticated) return false;
    var filter1 = TableQuery.int32Filter('WeekNumber', TableUtilities.QueryComparisons.EQUAL, args.weekNumber);
    var filter2 = TableQuery.stringFilter('ResourceId', TableUtilities.QueryComparisons.EQUAL, context.user.profile.oid);
    var combinedFilters = TableQuery.combineFilters(filter1, TableUtilities.TableOperators.AND, filter2);
    const query = new TableQuery().where(combinedFilters).top(100);
    const result = await queryTable(process.env.AZURE_STORAGE_CONFIRMEDTIMEENTRIES_TABLE_NAME, query);
    return result.length === 1;
};