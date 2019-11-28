const { queryTable, parseArray, createQuery, combine, isEqual, stringFilter } = require('../../../services/table');

async function getProjects(_obj, args, context) {
    let query = createQuery(1000, ['RowKey', 'CustomerKey', 'ProjectKey', 'Name', 'Description', 'Icon']);
    let filter = stringFilter('PartitionKey', isEqual, context.user.profile._json.tid);
    if (args.customerKey) {
        filter = combine(filter, and, stringFilter('CustomerKey', isEqual, args.customerKey));
    }
    query = query.where(filter);
    const result = await queryTable(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, query);
    const projects = parseArray(result).map(r => ({
        ...r,
        key: `${r.customerKey} ${r.projectKey}`,
    }));
    return projects;
}

module.exports = getProjects;