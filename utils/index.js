const moment = require('moment');

function getDurationMinutes(startTime, endTime) {
    return moment.duration(moment(endTime).diff(moment(startTime))).asMinutes()
}

module.export = {
    getDurationMinutes,
}