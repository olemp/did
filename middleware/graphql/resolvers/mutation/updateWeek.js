const log = require('debug')('middleware/graphql/resolvers/mutation/updateWeek');

/**
 * Update week
 * 
 * @param {*} _obj Unused object
 * @param {*} args Args (weekNumber, closed)
 * @param {*} context Context
 */
async function updateWeek(_obj, args, context) {
    await context.services.storage.updateWeek(args.weekNumber, args.closed);
    if (args.closed) log('Closing week %s', args.weekNumber);
    else log('Opening week %s', args.weekNumber);
    return args.closed;
}

module.exports = updateWeek;