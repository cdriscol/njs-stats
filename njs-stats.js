#!/usr/bin/env node
global.Q = require("bluebird");
global.program = require('commander');
global.logger = require('./logger');

program
    .version('0.0.1')
    .usage('[options] [directory]')
    .option('-g, --gitlog [interval]', 'walk back through gitlog at specified interval (weekly or monthly)', /^(monthly|weekly)$/i)
    .option('-v, --verbose', 'verbose output')
    .option('-b, --branch [name]', 'git branch to use for history', 'master')
    .option('-i, --ignore [dirs]', 'additional directory names to ignore (not quoted, comma-separated)')
    .option('[directory]', 'directory to scan, defaults to current directory');

program.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    $ njs-stats -v -i spec,dummyData /c/projects/some-node-app');
    console.log('');
});

program.parse(process.argv);

program.directory = program.args.length ? program.args[0] : __dirname;

logger.info('Starting njs-stats in directory', program.directory);

var stats = require('./stats');
var output = require('./output');
var fileAggregator = require('./file-aggregator');
var gitlog = require('./gitlog');

var getStatsQ = program.gitlog ? collectStatsWithHistoryQ() : collectStatsQ();

getStatsQ
    .then(output.writeToCsvQ)
    .then(function () {
        process.exit(0);
    })
    .catch(function (error) {
        logger.error(error);
        process.exit(1);
    });

function collectStatsQ() {
    return fileAggregator
        .findAllFilesQ()
        .then(stats.collectStatsQ);
}

function collectStatsWithHistoryQ() {
    return gitlog
        .getHistoryQ()
        .then(function (commits) {
            var commitsQ = [];
            commits.forEach(function (commit) {
                // todo: first promise step should check out code
                logger.info('checking out code from', commit.sha, '(', commit.date, ')');

                commitsQ.push(collectStatsQ());
            });

            return Q
                .reduce(commitsQ, function (oldCsv, newData) {
                    // todo: build up CSV output
                    logger.log('newData', newData);
                    return oldCsv;
                }, []);
        });
}