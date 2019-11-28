const {
    queryTable,
    parseArray,
    createQuery,
} = require('../../../services/table');

async function getCustomers(_obj, _args, context) {
    const query = createQuery(1000, ['RowKey', 'CustomerKey', 'Name', 'Description', 'WebLink']).where('PartitionKey eq ?', context.tid);
    const result = await queryTable(process.env.AZURE_STORAGE_CUSTOMERS_TABLE_NAME, query);
    return parseArray(result).map(r => ({ ...r, key: r.customerKey }));;
};

module.exports = getCustomers;