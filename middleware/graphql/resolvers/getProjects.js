const { queryTable, parseArray, createQuery, combine, and, isEqual, stringFilter } = require('../../../services/table');
const arraySort = require('array-sort');

async function getProjects(_obj, args, context) {
    let filter = stringFilter('PartitionKey', isEqual, context.tid);
    if (args.customerKey) {
        filter = combine(filter, and, stringFilter('CustomerKey', isEqual, args.customerKey));
    }
    let query = createQuery(1000, ['RowKey', 'CustomerKey', 'ProjectKey', 'Name', 'Description', 'Icon'], filter);
    const result = await queryTable(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, query);
    let projects = parseArray(result).map(r => ({
        ...r,
        key: [r.customerKey, r.projectKey].join(' ').toUpperCase(),
    }));
    if (args.sortBy) projects = arraySort(projects, args.sortBy);
    return projects;
}

module.exports = getProjects;