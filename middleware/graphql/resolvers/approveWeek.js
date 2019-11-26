const { TableUtilities } = require('azure-storage');
const entGen = TableUtilities.entityGenerator;
const graph = require('../../../services/graph');
const { addEntity } = require('../../../services/table');
const utils = require('../../../utils');

module.exports = async (_obj, { entries, weekNumber }, { user, tid, isAuthenticated }) => {
    if (!isAuthenticated) return false;
    const calendarView = await graph.getCalendarView(user.oauthToken.access_token, weekNumber);
    for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        let event = calendarView.filter(e => e.id === entry.id)[0];
        let [customerKey, projectKey] = entry.projectKey.split(' ');
        await addEntity(process.env.AZURE_STORAGE_APPROVEDTIMEENTRIES_TABLE_NAME, {
            PartitionKey: entGen.String(tid),
            RowKey: entGen.String(entry.id),
            Title: entGen.String(event.subject),
            Description: entGen.String(event.body),
            StartTime: entGen.DateTime(new Date(event.startTime)),
            EndTime: entGen.DateTime(new Date(event.endTime)),
            DurationHours: entGen.Double(utils.getDurationHours(event.startTime, event.endTime)),
            CustomerKey: entGen.String(customerKey),
            ProjectKey: entGen.String(projectKey),
            WebLink: entGen.String(event.webLink),
            WeekNumber: entGen.Int32(weekNumber),
            YearNumber: entGen.Int32(utils.getYear()),
            ResourceId: entGen.String(user.profile.oid),
            ResourceEmail: entGen.String(user.profile.email),
            ResourceName: entGen.String(user.profile.displayName),
        });
    }
    return true;
};