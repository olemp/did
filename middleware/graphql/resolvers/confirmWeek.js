const { TableBatch } = require('azure-storage');
const { executeBatch, entGen } = require('../../../utils/table');
const { getDurationHours, getDurationMinutes } = require('../../../utils');
const log = require('debug')('middleware/graphql/confirmWeek');

async function confirmWeek(_obj, args, context) {
    if (!args.entries || args.entries.length === 0) return false;
    log('Confirming week %s', args.weekNumber);
    const calendarView = await context.services.graph.getEvents(args.weekNumber);
    const batch = new TableBatch();
    args.entries.forEach(entry => {
        let event = calendarView.filter(e => e.id === entry.id)[0];
        if (!event) return;
        let key = entry.projectKey.split(' ');
        const durationHours = getDurationHours(event.startTime, event.endTime);
        const durationMinutes = getDurationMinutes(event.startTime, event.endTime);
        batch.insertEntity({
            PartitionKey: entGen.String(context.tid),
            RowKey: entGen.String(entry.id),
            Title: entGen.String(event.title),
            Description: entGen.String(event.body),
            StartTime: entGen.DateTime(new Date(event.startTime)),
            EndTime: entGen.DateTime(new Date(event.endTime)),
            DurationHours: entGen.Double(durationHours),
            DurationMinutes: entGen.Int32(durationMinutes),
            CustomerKey: entGen.String(key[0]),
            ProjectKey: entGen.String(key[1]),
            WebLink: entGen.String(event.webLink),
            WeekNumber: entGen.Int32(args.weekNumber),
            MonthNumber: entGen.Int32(utils.getMonth()),
            YearNumber: entGen.Int32(utils.getYear()),
            ResourceId: entGen.String(context.user.profile.oid),
            ResourceEmail: entGen.String(context.user.profile.email),
            ResourceName: entGen.String(context.user.profile.displayName),
        });
    });
    await executeBatch(process.env.AZURE_STORAGE_CONFIRMEDTIMEENTRIES_TABLE_NAME, batch)
    return true;
};

module.exports = confirmWeek;