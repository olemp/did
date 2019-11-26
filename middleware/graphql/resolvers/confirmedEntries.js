const { TableQuery } = require('azure-storage');
const { queryTable, parseArray } = require('../../../services/table');

module.exports = async (_obj, _args, { isAuthenticated }) => {
    if (!isAuthenticated) return [];
    let query = new TableQuery().top(1000);
    const result = await queryTable(process.env.AZURE_STORAGE_CONFIRMEDTIMEENTRIES_TABLE_NAME, query);
    return parseArray(result);
};