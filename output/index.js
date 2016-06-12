var json2csv = require('json2csv');
var fs = require('fs');
var path = require('path');

module.exports = {
  writeToCsvQ: writeToCsvQ
};

function writeToCsvQ(data) {
    var outputPath = path.resolve(program.output);
    logger.info('writing CSV output to ', outputPath);
    return new Promise(function (resolve, reject) {
        var fields = [
            'commit.sha',
            'commit.date',
            'path'
        ];
        json2csv({ data: data, fields: fields }, function(err, csv) {
            if (err) return reject(err);
            fs.writeFile(outputPath, csv, function(err) {
                if (err) return reject(err);
                resolve();
            });
        }); 
    });
}