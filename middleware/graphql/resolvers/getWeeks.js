const log = require('debug')('middleware/graphql/getWeeks');

/**
 * Get projects
 * 
 * @param {*} _obj Unused object
 * @param {*} _args Unused args
 * @param {*} context Context
 */
async function getWeeks(_obj, _args, context) {
    let weeks = await context.services.storage.getWeeks();
    log('Retrieved %s weeks from storage', weeks.length);
    return weeks;
}

module.exports = getWeeks;