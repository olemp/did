const { TableQuery } = require('azure-storage');
const { queryTable, parseArray } = require('../../../services/table');
const utils = require('../../../utils');

module.export = async (_obj, { projectKey }, { isAuthenticated }) => {
    if (!isAuthenticated) return [];
    let query = new TableQuery().top(50);
    if (projectKey != '') query = query.where('ProjectKey eq ?', projectKey);
    const result = await queryTable(process.env.AZURE_STORAGE_APPROVEDTIMEENTRIES_TABLE_NAME, query);
    const entries = parseArray(result).map(entry => ({
        ...entry,
        duration: utils.getDurationMinutes(entry.startTime, entry.endTime),
    }));
    return entries;
};