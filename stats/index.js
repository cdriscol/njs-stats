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
              var countSpecQ = require('./countSpecs');
              return countSpecQ(stat.path)
                .then(function (specCount) {
                  stat.isSpec = specCount;
                  return code;
                });
            })
            .then(function (code) {
                var calcLocDataQ = require('./calcLocData');
                return calcLocDataQ(code)
                    .then(function (locData) {
                        stat.loc = locData;
                        return code;
                    });
            })
            .then(function (code) {
                var countRequiresQ = require('./countRequires');
                return countRequiresQ(code)
                    .then(function (requireCount) {
                        stat.requireCount = requireCount;
                        return code;
                    });
            })
            .then(function (code) {
                var countExpectsQ = require('./countExpects');
                return countExpectsQ(code)
                    .then(function (expectCount) {
                        stat.expectCount = expectCount;
                        return code;
                    });
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