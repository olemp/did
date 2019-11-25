const { createTableService, TableQuery } = require('azure-storage');
const azureTableService = createTableService(process.env.AZURE_STORAGE_CONNECTION_STRING);

function query(table, query) {
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


function add(table, item) {
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

module.exports = {
    query: query,
    add: add,
    getSubscription: (tenantId) => {
        return new Promise(async (resolve) => {
            var sub = await query(process.env.AZURE_STORAGE_SUBSCRIPTIONS_TABLE_NAME, new TableQuery().top(1).where('RowKey eq ?', tenantId));
            resolve(sub[0]);
        });
    },
    parseArray: (arr) => {
        return arr.map(item => Object.keys(item).reduce((obj, key) => {
            const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
            const value = item[key]._;
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
}