var chalk = require('chalk');

module.exports = {
    log: writeLog,
    info: writeInfo,
    error: writeError,
    warn: writeWarn
};

function writeLog() {
    if(program.verbose) console.log.apply(this, arguments);
}

function writeWarn() {
    console.warn.apply(this, arguments);
}

function writeError() {
    console.error(chalk.red.apply(this, arguments));
}

function writeInfo() {
    console.info.apply(this, arguments);
}