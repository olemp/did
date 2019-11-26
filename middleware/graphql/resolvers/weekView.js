const { queryTable, parseArray } = require('../../../services/table');
const graph = require('../../../services/graph');
const utils = require('../../../utils');

module.exports = async (_obj, { weekNumber }, { user, isAuthenticated }) => {
    if (!isAuthenticated) return [];
    const calendarView = await graph.getCalendarView(user.oauthToken.access_token, weekNumber);
    const result = await queryTable(process.env.AZURE_STORAGE_PROJECTS_TABLE_NAME, new TableQuery().top(1000).where('PartitionKey eq ?', user.profile._json.tid).select('CustomerKey', 'ProjectKey', 'Name'));
    const projects = parseArray(result).map(r => ({ ...r, key: `${r.customerKey} ${r.projectKey}` }));
    const events = calendarView
        .filter(event => event.subject.toUpperCase().indexOf('IGNORE') === -1)
        .filter(event => event.body.toUpperCase().indexOf('IGNORE') === -1)
        .filter(event => event.categories.indexOf('IGNORE') === -1)
        .map(event => {
            let duration = utils.getDurationMinutes(event.startTime, event.endTime);
            return {
                id: event.id,
                subject: event.subject,
                webLink: event.webLink,
                startTime: event.startTime,
                endTime: event.endTime,
                duration,
                project: projects.filter(p =>
                    event.subject.toUpperCase().indexOf(p.key.toUpperCase()) !== -1
                    || event.body.toUpperCase().indexOf(p.key.toUpperCase()) !== -1
                    || event.categories.indexOf(p.key) !== -1
                )[0]
            };
        });
    return events;
};