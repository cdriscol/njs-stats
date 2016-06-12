var calcLocDataQ = require('./calcLocData');
var countRequiresQ = require('./countRequires');
var fs = Q.promisifyAll(require('fs'), {suffix: 'Q'});
var path = require('path');

module.exports = {
    collectStatsQ: collectStatsQ
};

function collectStatsQ(files) {
    var statData = [];
    var statQs = [];
    files.forEach(file => {
        var stat = {
            path: file,
            fullPath: path.join(program.directory, file)
        };

        var fileStatQ = fs
            .readFileQ(stat.fullPath, 'utf8')
            .then(function (code) {
                return calcLocDataQ(code)
                    .then(function (locData) {
                        stat.loc = locData;
                        return code;
                    });
            })
            .then(function (code) {
                return countRequiresQ(code)
                    .then(function (requireCount) {
                        stat.requireCount = requireCount;
                        return code;
                    })
            });

        statQs.push(fileStatQ);
        statData.push(stat);
    });

    return Q
        .all(statQs)
        .then(function () {
            return statData;
        });
}