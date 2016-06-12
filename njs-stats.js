#!/usr/bin/env node
global.Q = require("bluebird");
global.program = require('commander');
global.logger = require('./logger');

program
    .version('0.0.1')
    .usage('[options] [directory]')
    .option('-g, --gitlog [interval]', 'walk back through gitlog at specified interval (weekly or monthly)', /^(monthly|weekly)$/i)
    .option('-v, --verbose', 'verbose output')
    .option('-o, --output [name]', 'path/name for the csv output file')
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

if(program.output === true) program.output = 'njs-stats-output.csv';

program.directory = program.args.length ? program.args[0] : __dirname;

logger.info('Starting njs-stats in directory', program.directory);

var stats = require('./stats');
var fileAggregator = require('./file-aggregator');
var gitlog = require('./gitlog');

var getStatsQ = program.gitlog ? collectStatsWithHistoryQ() : collectStatsQ();

getStatsQ
    .then(function (data) {
        if(!program.output) return;
        var output = require('./output');
        return output.writeToCsvQ(data);
    })
    .then(function () {
        logger.info('ending process successfully');
        process.exit(0);
    })
    .catch(function (error) {
        logger.error(error);
        process.exit(1);
    });

function collectStatsQ() {
    return fileAggregator
        .findAllFilesQ()
        .then(function (files) {
            return stats.collectStatsQ(files);
        });
}

function collectStatsWithHistoryQ() {
    return gitlog
        .getHistoryQ()
        .then(function (commits) {
            var csvData = [];
            return Q
                .each(commits, function (commit) {
                    return gitlog
                        .checkoutShaQ(commit)
                        .then(function () {
                            return collectStatsQ();
                        })
                        .then(function (statData) {
                            statData = statData.map(stat => {
                                stat.commit = commit;
                                return stat;
                            });
                            csvData = csvData.concat(statData);
                            return csvData;
                        });
                })
                .then(function () {
                    return csvData;
                });
        });
}