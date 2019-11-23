const { createTableService } = require('azure-storage');
const tableService = createTableService(process.env.AZURETABLESTORAGE);

module.exports = {
    query: (table, query) => {
        return new Promise((resolve, reject) => {
            tableService.queryEntities(table, query, null, (error, result) => {
                if (!error) {
                    return resolve(result.entries);
                } else {
                    reject(error);
                }
            });
        });
    },

}