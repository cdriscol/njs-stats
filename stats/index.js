module.exports = {
    collectStatsQ: collectStatsQ
};

function collectStatsQ(files) {
    var statData = [];
    files.forEach(file => {
        var stat = { path: file };
        statData.push(stat);
    });
    return Q.resolve(statData);
}