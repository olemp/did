const { createTableService } = require('azure-storage');
const azureTableService = createTableService(process.env.AZURETABLESTORAGE);

module.exports = {
    query: (table, query) => {
        return new Promise((resolve, reject) => {
            azureTableService.queryEntities(table, query, null, (error, result) => {
                if (!error) {
                    return resolve(result.entries);
                } else {
                    reject(error);
                }
            });
        });
    },

    add: (table, item) => {
        return new Promise((resolve, reject) => {
            azureTableService.insertEntity(table, item, (error, result) => {
                if (!error) {
                    return resolve(result['.metadata']);
                } else {
                    reject(error);
                }
            })
        });
    }
}