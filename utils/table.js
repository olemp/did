const { createTableService, TableQuery, TableUtilities } = require('azure-storage');
const azureTableService = createTableService(process.env.AZURE_STORAGE_CONNECTION_STRING);
const moment = require('moment');

/**
 * Parse an array of azure table storage entities
 * 
 * Makes the keys camelCase and adds RowKey as 'id' and 'key
 * 
 * Also skips PartitionKey
 * 
 * @param {*} arr The array of entities to parse
 * @param {*} mapFunc Mapping function (optional)
 * @param {*} options Options (optional)
 */
function parseArray(arr, mapFunc, options) {
    options = options || {};
    let result = arr.map(item => Object.keys(item)
        .filter(key => key !== 'PartitionKey')
        .reduce((obj, key) => {
            const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
            const value = item[key]._;
            if (key === 'RowKey') {
                obj.id = options.idUpper ? value.toUpperCase() : value;
                obj.key = obj.id;
                return obj;
            }
            switch (item[key].$) {
                case 'Edm.DateTime': {
                    let dateValue = value.toISOString();
                    if (options.dateFormat) {
                        dateValue = moment(dateValue).format(options.dateFormat);
                    }
                    obj[camelCaseKey] = dateValue;
                }
                    break;
                default: {
                    obj[camelCaseKey] = value;
                }
            }
            return obj;
        }, {}));
    if (mapFunc) result = result.map(mapFunc);
    return result;
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
    gt: TableUtilities.QueryComparisons.GREATER_THAN,
    lt: TableUtilities.QueryComparisons.LESS_THAN,
    isEqual: TableUtilities.QueryComparisons.EQUAL,
    and: TableUtilities.TableOperators.AND,
    combine: TableQuery.combineFilters,
    stringFilter: TableQuery.stringFilter,
    intFilter: TableQuery.int32Filter,
    dateFilter: TableQuery.dateFilter,
    createQuery: createQuery,
    entGen: TableUtilities.entityGenerator,
}