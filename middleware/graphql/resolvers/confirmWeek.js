const { TableUtilities, TableBatch } = require('azure-storage');
const entGen = TableUtilities.entityGenerator;
const GraphService = require('../../../services/graph');
const { executeBatch } = require('../../../services/table');
const utils = require('../../../utils');

async function confirmWeek(_obj, args, context) {
    const calendarView = await new GraphService(context.user.oauthToken.access_token).getEvents(args.weekNumber);
    const batch = new TableBatch();
    let totalDurationHours = 0;
    args.entries.forEach(entry => {
        let event = calendarView.filter(e => e.id === entry.id)[0];
        let [customerKey, projectKey] = entry.projectKey.split(' ');
        const durationHours = utils.getDurationHours(event.startTime, event.endTime);
        const durationMinutes = utils.getDurationMinutes(event.startTime, event.endTime);
        totalDurationHours += durationHours;
        batch.insertEntity({
            PartitionKey: entGen.String(context.tid),
            RowKey: entGen.String(entry.id),
            Title: entGen.String(event.title),
            Description: entGen.String(event.body),
            StartTime: entGen.DateTime(new Date(event.startTime)),
            EndTime: entGen.DateTime(new Date(event.endTime)),
            DurationHours: entGen.Double(durationHours),
            DurationMinutes: entGen.Int32(durationMinutes),
            CustomerKey: entGen.String(customerKey),
            ProjectKey: entGen.String(projectKey),
            WebLink: entGen.String(event.webLink),
            WeekNumber: entGen.Int32(args.weekNumber),
            MonthNumber: entGen.Int32(utils.getMonth()),
            YearNumber: entGen.Int32(utils.getYear()),
            ResourceId: entGen.String(user.profile.oid),
            ResourceEmail: entGen.String(user.profile.email),
            ResourceName: entGen.String(user.profile.displayName),
        });
    });
    await executeBatch(process.env.AZURE_STORAGE_CONFIRMEDTIMEENTRIES_TABLE_NAME, batch)
    return totalDurationHours;
};

module.exports = confirmWeek;