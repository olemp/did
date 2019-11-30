const log = require('debug')('middleware/graphql/getCustomers');

/**
 * Get customers
 * 
 * @param {*} _obj Unused object
 * @param {*} _args Unused args
 * @param {*} context Context
 */
async function getCustomers(_obj, _args, context) {
    let customers = await context.services.storage.getCustomers();
    log('Retrieved %s customers from storage', customers.length);
    return customers;
};

module.exports = getCustomers;