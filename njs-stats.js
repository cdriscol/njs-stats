#!/usr/bin/env node
global.Q       = require("bluebird");
global.program = require('commander');
global.logger  = require('./logger');

program
    .version('0.0.1')
    .usage('[options] [directory]')
    .option('-v, --verbose', 'verbose output')
    .option('[directory]', 'directory to scan, defaults to current directory')
    .parse(process.argv);

program.directory = program.args.length ? program.args[0] : __dirname;

logger.info('Starting njs-stats in directory ' + program.directory);

var stats = require('./stats');
var output = require('./output');
var fileAggregator = require('./file-aggregator');

fileAggregator
    .findAllFilesQ()
    .then(stats.collectStatsQ)
    .then(output.writeToCsvQ)
    .then(function () {
        process.exit(0);
    })
    .catch(function (error) {
        logger.error(error);
        process.exit(1);
    });