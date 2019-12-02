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
 * @param {*} options Options
 */
function parseArray(arr, options) {
    options = options || {};
    return arr.map(item => Object.keys(item)
        .filter(key => key !== 'PartitionKey')
        .reduce((obj, key) => {
            const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
            const value = item[key]._;
            if (key === options.idField) {
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
 * @param {*} filter 
 */
function createQuery(top, select, filter) {
    let query = new TableQuery().top(top);
    if (select) {
        query = query.select(select);
    }
    if (filter) {
        query = query.where(filter);
    }
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
 * Updates the entity
 * 
 * @param {*} table 
 * @param {*} item 
 */
function updateEntity(table, item) {
    return new Promise((resolve, reject) => {
        azureTableService.insertOrReplaceEntity(table, item, undefined, (error, result) => {
            if (!error) {
                resolve(result);
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

module.exports = {
    queryTable: queryTable,
    addEntity: addEntity,
    updateEntity: updateEntity,
    executeBatch: executeBatch,
    parseArray: parseArray,
    isEqual: TableUtilities.QueryComparisons.EQUAL,
    and: TableUtilities.TableOperators.AND,
    combine: TableQuery.combineFilters,
    stringFilter: TableQuery.stringFilter,
    intFilter: TableQuery.int32Filter,
    createQuery: createQuery,
    entGen: TableUtilities.entityGenerator,
}