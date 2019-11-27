import * as chalk from 'chalk';
import * as log from 'loglevel';
import * as prefix from 'loglevel-plugin-prefix';
var colors = {
    TRACE: chalk.magenta,
    DEBUG: chalk.cyan,
    INFO: chalk.blue,
    WARN: chalk.yellow,
    ERROR: chalk.red,
};
prefix.reg(log);
log.enableAll();
prefix.apply(log, {
    format: function (level, name, timestamp) {
        return chalk.gray("[" + timestamp + "]") + " " + colors[level.toUpperCase()](level) + " " + chalk.green(name + ":");
    },
});
prefix.apply(log.getLogger('critical'), {
    format: function (level, name, timestamp) {
        return chalk.red.bold("[" + timestamp + "] " + level + " " + name + ":");
    },
});
export default log;
//# sourceMappingURL=log.js.map