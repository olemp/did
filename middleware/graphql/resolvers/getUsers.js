const log = require('debug')('middleware/graphql/getUsers');

/**
 * Get users
 * 
 * @param {*} _obj Unused object
 * @param {*} _args Unused args
 * @param {*} context Context
 */
async function getUsers(_obj, _args, context) {
    let users = await context.services.storage.getUsers();
    log('Retrieved %s users from storage', users.length);
    return users;
}

module.exports = getUsers;