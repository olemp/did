const log = require('debug')('middleware/graphql/resolvers/query/faq');

/**
 * FAQ
 * 
 * @param {*} _obj Unused object
 * @param {*} _args Unused args
 * @param {*} context Context
 */
async function faq(_obj, _args, context) {
    let faq = await context.services.storage.getFAQ();
    log('Retrieved %s questions and answers (FAQ) from storage', faq.length);
    return faq;
}

module.exports = faq;