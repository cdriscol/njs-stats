var path = require('path');
var exec = require('child_process').exec;

module.exports = {
    getHistoryQ: getHistory,
    checkoutShaQ: checkoutShaQ
};

function getHistory() {
    logger.log('getting git-log history', program.gitlog);
    var now = new Date();
    var currentYear = now.getFullYear();
    var currentMonth = now.getMonth();
    var datesToCheck = ['today'];
    if (program.gitlog === 'weekly') {
        var currentDate = now.getDate();
        var weekDate = new Date(currentYear, currentMonth, currentDate);
        //walk back 52 weeks
        for (var w = 0; w < 52; w++) {
            datesToCheck.push(formatDate(weekDate));
            weekDate.setDate(weekDate.getDate() - 7);
        }
    } else {
        var monthDate = new Date(currentYear, currentMonth);
        // go back 12 months
        for (var m = 0; m < 12; m++) {
            datesToCheck.push(formatDate(monthDate));
            monthDate.setMonth(monthDate.getMonth() - 1);
        }
    }

    var datesToCheckQs = datesToCheck.map(function (formattedDate) {
        return new Promise((resolve, reject) => {
            var command = 'git rev-list -n 1 --before="' + formattedDate + '" --pretty ' + program.branch;
            logger.log('running', command);

            exec(command, {cwd: program.directory}, (err, stdout) => {
                if (err) return reject(err);
                if (!stdout) return resolve([]);

                var logEntry = parseLog(stdout);
                logger.log('output from', logEntry.sha, ':', logEntry.date);
                resolve([logEntry]);
            });
        });
    });

    return Q
        .reduce(datesToCheckQs, (prev, curr) => {
            return prev.concat(curr);
        }, [])
        .then(shas => {
            return shas;
        });
}

function checkoutShaQ(commit) {
    return new Promise(function (resolve, reject) {
        var command = 'git checkout ' + commit.sha + ' && git clean -fd';
        logger.info('checking out code from', commit.sha, '(', commit.date, ')');
        logger.log('running', command);

        exec(command, {cwd: program.directory}, function (err, stdout, stderr) {
            if (err) return reject(err);
            if (stdout.indexOf('error:') === 0) return reject(stdout);
            if(stderr) logger.warn(stderr);
            
            logger.info('checked out', commit.sha);
            resolve(commit);
        });
    });
}

function parseLog(entry) {
    var date = '';
    var sha = '';
    entry
        .split('\n')
        .forEach(line => {
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