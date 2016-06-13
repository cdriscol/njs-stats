var json2csv = require('json2csv');
var fs = require('fs');
var path = require('path');

module.exports = {
  writeToCsvQ: writeToCsvQ
};

function writeToCsvQ(data) {
    formatData(data);
    var outputPath = path.resolve(program.output);
    logger.info('writing CSV output to ', outputPath);
    return new Promise(function (resolve, reject) {
        json2csv({ data: data, flatten: true }, function(err, csv) {
            if (err) return reject(err);
            fs.writeFile(outputPath, csv, function(err) {
                if (err) return reject(err);
                resolve();
            });
        }); 
    });
}

function formatData(data) {
    if(!data.length || !data[0].commit) return;

    data.forEach(row => {
        var commitDate = new Date(Date.parse(row.commit.date));
        row.date = formatDate(commitDate);
    });
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
}