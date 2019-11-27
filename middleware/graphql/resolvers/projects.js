const { queryTable, parseArray, createQuery } = require('../../../services/table');

module.exports = async () => {
    const query = createQuery(1000, ['RowKey', 'CustomerKey', 'ProjectKey', 'Name', 'Description', 'WebLink']);
    const result = await queryTable(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, query);
    return parseArray(result).map(r => ({ ...r, key: `${r.customerKey} ${r.projectKey}` }));
};