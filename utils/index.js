const moment = require('moment');

module.exports = {
    getDurationMinutes: (startTime, endTime) => {
        return moment.duration(moment(endTime).diff(moment(startTime))).asMinutes()
    },
    getDurationHours: (startTime, endTime) => {
        return moment.duration(moment(endTime).diff(moment(startTime))).asHours()
    },
    getYear: () => {
        return moment().year();
    },
    getMonth: () => {
        return moment().month() + 1;
    }
}