const moment = require('moment');

module.exports = {
    getDurationMinutes: (startTime, endTime) => {
        return moment.duration(moment(endTime).diff(moment(startTime))).asMinutes()
    },
    getYear: () => {
        return moment().year();
    }
}