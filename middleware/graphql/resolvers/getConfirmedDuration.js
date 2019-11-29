const { queryTable, createQuery, combine, and, isEqual, stringFilter, intFilter } = require('../../../services/table');

async function getConfirmedDuration(_obj, args, context) {
    let filter = intFilter('WeekNumber', isEqual, args.weekNumber);
    filter = combine(filter, and, stringFilter('ResourceId', isEqual, context.user.profile.oid));
    const query = createQuery(100, args.type, filter);
    const result = await queryTable(process.env.AZURE_STORAGE_CONFIRMEDTIMEENTRIES_TABLE_NAME, query);
    return result.reduce((sum, r) => sum + r[args.type]._, 0);
};

module.exports = getConfirmedDuration;