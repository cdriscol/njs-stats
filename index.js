#!/usr/bin/env node
global.Q = require("bluebird");
global.program = require('commander');

program
    .version('0.0.1')
    .option('-v, --verbose', 'Verbose output')
    .option('-w, --workingDir [dir]', 'Directory to scan', __dirname)
    .parse(process.argv);

var logger  = require('./logger');
logger.debug('Starting njs-stats from ' + program.workingDir);

var stats = require('./stats');
var output = require('./output');

stats
    .collectStatsQ()
    .then(output.writeToCsvQ)
    .then(function () {
        process.exit(0);
    })
    .catch(function (error) {
        logger.error(error);
        process.exit(1);
    });