var path = require('path');
var exec = require('child_process').exec;

module.exports = {
    getHistoryQ: getHistory
};

function getHistory() {
    logger.log('getting git-log history', program.gitlog);
    var now = new Date();
    var currentYear = now.getFullYear();
    var currentMonth = now.getMonth();
    var datesToCheck = [];
    if (program.gitlog === 'weekly') {
        var currentDate = now.getDate();
        var weekDate = new Date(currentYear, currentMonth, currentDate);
        //walk back 104 weeks
        for (var w = 0; w < 104; w++) {
            datesToCheck.push(formatDate(weekDate));
            weekDate.setMonth(weekDate.getDate() - 7);
        }
    } else {
        var monthDate = new Date(currentYear, currentMonth);
        // go back 24 months
        for (var m = 0; m < 24; m++) {
            datesToCheck.push(formatDate(monthDate));
            monthDate.setMonth(monthDate.getMonth() - 1);
        }
    }

    var datesToCheckQs = datesToCheck.map(function (formattedDate) {
        return new Promise(function (resolve, reject) {
            var command = 'git rev-list -n 1 --before="' + formattedDate + '" --pretty ' + program.branch;
            logger.log('running', command);

            exec(command, {cwd: program.directory}, function (err, stdout, stderr) {
                if (err) return reject(err);
                if (!stdout) return resolve([]);

                var logEntry = parseLog(stdout);
                logger.log('output from', logEntry.sha, ':', logEntry.date);
                resolve([logEntry]);
            });
        });
    });

    return Q
        .reduce(datesToCheckQs, function (prev, curr) {
            return prev.concat(curr);
        }, [])
        .then(function (shas) {
            // TODO: sort this chronologically?
            return shas;
        });
}

function parseLog(entry) {
    var date = '';
    var sha = '';
    entry
        .split('\n')
        .forEach(function (line) {
            if (line.indexOf('Date:') === 0) {
                date = line.replace('Date:  ', '')
            }

            if (line.indexOf('commit') === 0) {
                sha = line.replace('commit ', '');
            }
        });

    return {
        sha: sha,
        date: date
    };
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}