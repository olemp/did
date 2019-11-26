const { TableQuery } = require('azure-storage');
const { queryTable, parseArray } = require('../../../services/table');

module.exports = async () => {
    const result = await queryTable(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, new TableQuery().top(1000).select('RowKey', 'CustomerKey', 'ProjectKey', 'Name'));
    return parseArray(result).map(r => ({ ...r, key: `${r.customerKey} ${r.projectKey}` }));
};