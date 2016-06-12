const EXPECT_REGEX = /expect+\([^\)]*\)(\.[^\)]*\))?/g;

module.exports = function countExpectsQ(code) {
    //todo: account for xit's and xdescribe's
    var matches = code.match(EXPECT_REGEX);
    return Q.resolve(matches ? matches.length : 0);
};