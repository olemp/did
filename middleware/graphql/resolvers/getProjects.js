const log = require('debug')('middleware/graphql/getProjects');

async function getProjects(_obj, args, context) {
    let projects = await context.services.storage.getProjects(args.customerId, args.sortBy);
    log('Retrieved %s projects from storage', projects.length);
    return projects;
}

module.exports = getProjects;