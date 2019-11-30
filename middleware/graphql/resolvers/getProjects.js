const log = require('debug')('middleware/graphql/getProjects');

/**
 * Get projects
 * 
 * @param {*} _obj Unused object
 * @param {*} args Args (customerKey, sortBy)
 * @param {*} context Context
 */
async function getProjects(_obj, args, context) {
    let projects = await context.services.storage.getProjects(args.customerKey, args.sortBy);
    log('Retrieved %s projects from storage', projects.length);
    return projects;
}

module.exports = getProjects;