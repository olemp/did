const { queryTable, parseArray, isEqual, and, combine, stringFilter, createQuery } = require('../../../services/table');

async function confirmedEntries(_obj, args, { tid, isAuthenticated }) {
    if (!isAuthenticated) return [];
    let filter;
    let query = createQuery(1000);
    if (args.projectKey) {
        let [customerKey, projectKey,] = args.projectKey.split(' ');
        filter = combine(stringFilter('ProjectKey', isEqual, projectKey), and, stringFilter('CustomerKey', isEqual, customerKey));
    }
    if (args.resourceId) {
        filter = combine(filter, and, stringFilter('ResourceId', isEqual, args.resourceId));
    }
    query = query.where(filter);
    const result = await queryTable(process.env.AZURE_STORAGE_CONFIRMEDTIMEENTRIES_TABLE_NAME, query);
    const parsedResult = parseArray(result);
    /**
     * @todo Or should the client sort the result?
     */
    const sortedResult = parsedResult.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    return sortedResult;
};

module.exports = confirmedEntries;