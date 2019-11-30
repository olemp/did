const StorageService = require('../../../services/storage');
const log = require('debug')('middleware/graphql/getProjects');

async function getProjects(_obj, args, context) {
    let projects = await new StorageService(context.tid).getProjects(args.customerId, args.sortBy);
    log('Retrieved %s projects from storage', projects.length);
    return projects;
}

module.exports = getProjects;