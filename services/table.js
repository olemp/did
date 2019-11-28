const { createTableService, TableQuery, TableUtilities } = require('azure-storage');
const azureTableService = createTableService(process.env.AZURE_STORAGE_CONNECTION_STRING);

/**
 * Parse an array of azure table storage entities
 * 
 * Makes the keys camelCase and adds RowKey as 'id'
 * 
 * Also skips PartitionKey
 * 
 * @param {*} arr The array of entities to parse
 */
function parseArray(arr) {
    return arr.map(item => Object.keys(item)
        .filter(key => key !== 'PartitionKey')
        .reduce((obj, key) => {
            const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
            const value = item[key]._;
            if (key === 'RowKey') {
                obj.id = value;
                return obj;
            }
            switch (item[key].$) {
                case 'Edm.DateTime': {
                    obj[camelCaseKey] = value.toISOString();
                }
                    break;
                default: {
                    obj[camelCaseKey] = value;
                }
            }
            return obj;
        }, {}));
}

/**
 * Function that simplifes creating a new TableQuery from azure-storage
 * 
 * @param {*} top 
 * @param {*} select 
 */
function createQuery(top, select) {
    let query = new TableQuery().top(top);
    if (select) query = query.select(select);
    return query;
}

/**
 * Queries a table using the specified query
 * 
 * @param {*} table 
 * @param {*} query 
 */
function queryTable(table, query) {
    return new Promise((resolve, reject) => {
        azureTableService.queryEntities(table, query, null, (error, result) => {
            if (!error) {
                return resolve(result.entries);
            } else {
                reject(error);
            }
        });
    });
};

/**
 * Adds an entity
 * 
 * @param {*} table 
 * @param {*} item 
 */
function addEntity(table, item) {
    return new Promise((resolve, reject) => {
        azureTableService.insertEntity(table, item, (error, result) => {
            if (!error) {
                return resolve(result['.metadata']);
            } else {
                reject(error);
            }
        })
    });
};


/**
 * Executes a batch operation
 * 
 * @param {*} table 
 * @param {*} batch 
 */
function executeBatch(table, batch) {
    return new Promise((resolve, reject) => {
        azureTableService.executeBatch(table, batch, (error, result) => {
            if (!error) {
                return resolve(result);
            } else {
                reject(error);
            }
        })
    });
};

/**
 * Checks if the specified tenant id has a active subscription
 * 
 * @param {*} tenantId 
 */
function getSubscription(tenantId) {
    return new Promise(async (resolve) => {
        var sub = await queryTable(process.env.AZURE_STORAGE_SUBSCRIPTIONS_TABLE_NAME, new TableQuery().top(1).where('RowKey eq ?', tenantId));
        resolve(sub[0]);
    });
};

/**
 * Get user
 * 
 * @param {*} tenantId 
 * @param {*} userId 
 */
async function getUser(tenantId, userId) {
    let filter = TableQuery.stringFilter('PartitionKey', TableUtilities.QueryComparisons.EQUAL, tenantId);
    filter = TableQuery.combineFilters(filter, TableUtilities.TableOperators.AND, TableQuery.stringFilter('RowKey', TableUtilities.QueryComparisons.EQUAL, userId));
    const query = createQuery(1, ['Role', 'StartPage']).where(filter);
    const users = await queryTable(process.env.AZURE_STORAGE_USERS_TABLE_NAME, query);
    return parseArray(users)[0];
}

module.exports = {
    queryTable: queryTable,
    addEntity: addEntity,
    executeBatch: executeBatch,
    getSubscription: getSubscription,
    getUser: getUser,
    parseArray: parseArray,
    isEqual: TableUtilities.QueryComparisons.EQUAL,
    and: TableUtilities.TableOperators.AND,
    combine: TableQuery.combineFilters,
    stringFilter: TableQuery.stringFilter,
    intFilter: TableQuery.int32Filter,
    createQuery: createQuery,
}