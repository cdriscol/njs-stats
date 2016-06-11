var chalk = require('chalk');

module.exports = {
    debug: writeDebug,
    info: writeInfo,
    error: writeError,
    warn: writeWarn
};

function writeDebug() {
    if(program.verbose) console.log.apply(this, arguments);
}

function writeWarn() {
    console.warn.apply(this, arguments);
}

function writeError() {
    console.error(chalk.red.apply(this, arguments));
}

function writeInfo() {
    console.warn.apply(this, arguments);
}