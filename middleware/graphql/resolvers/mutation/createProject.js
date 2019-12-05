const log = require('debug')('middleware/graphql/resolvers/mutation/createProject');

/**
 * Get projects
 * 
 * @param {*} _obj Unused object
 * @param {*} args Args (customerKey, projectKey, name)
 * @param {*} context Context
 */
async function createProject(_obj, args, context) {
    try {
        log('Attempting to project in storage: ', JSON.stringify(args));
        let { etag } = await context.services.storage.createProject(args.customerKey, args.projectKey, args.name);
        log('Created project with key %s in storage', args.projectKey);
        return etag;
    } catch (error) {
        console.log(error);
        log('Failed to create project with key %s in storage', args.projectKey);
        return null;
    }
}

module.exports = createProject;