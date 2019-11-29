const { queryTable, parseArray, isEqual, and, combine, stringFilter, createQuery } = require('../../../services/table');

async function getConfirmedEntries(_obj, args, context) {
    let filter = stringFilter('PartitionKey', isEqual, context.tid);
    let query = createQuery(1000);
    if (args.projectKey) {
        let [customerKey, projectKey,] = args.projectKey.split(' ');
        filter = combine(filter, and, combine(stringFilter('ProjectKey', isEqual, projectKey), and, stringFilter('CustomerKey', isEqual, customerKey)));
    }
    if (args.resourceId) {
        filter = combine(filter, and, combine(filter, and, stringFilter('ResourceId', isEqual, args.resourceId)));
    }
    query = query.where(filter);
    const result = await queryTable(process.env.AZURE_STORAGE_CONFIRMEDTIMEENTRIES_TABLE_NAME, query);
    const parsedResult = parseArray(result);
    const sortedResult = parsedResult.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    return sortedResult;
};

module.exports = getConfirmedEntries;