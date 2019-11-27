const { createTableService, TableQuery, TableUtilities } = require('azure-storage');
const azureTableService = createTableService(process.env.AZURE_STORAGE_CONNECTION_STRING);

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

function getSubscription(tenantId) {
    return new Promise(async (resolve) => {
        var sub = await queryTable(process.env.AZURE_STORAGE_SUBSCRIPTIONS_TABLE_NAME, new TableQuery().top(1).where('RowKey eq ?', tenantId));
        resolve(sub[0]);
    });
};

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

module.exports = {
    queryTable: queryTable,
    addEntity: addEntity,
    executeBatch: executeBatch,
    getSubscription: getSubscription,
    parseArray: parseArray,
    isEqual: TableUtilities.QueryComparisons.EQUAL,
    and: TableUtilities.TableOperators.AND,
    combine: TableQuery.combineFilters,
    stringFilter: TableQuery.stringFilter,
    createQuery: (top) => {
        return new TableQuery().top(top);
    }
}