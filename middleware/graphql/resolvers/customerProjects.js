const { TableQuery } = require('azure-storage');
const { queryTable, parseArray } = require('../../../services/table');

module.exports = async (_obj, args, { isAuthenticated }) => {
    if (!isAuthenticated) return [];
    const result = await queryTable(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, new TableQuery().top(50).where('CustomerKey eq ?', args.customerKey).select('CustomerKey', 'ProjectKey', 'Name'));
    const projects = parseArray(result).map(r => ({ ...r, key: `${r.customerKey} ${r.projectKey}` }));
    return projects;
};