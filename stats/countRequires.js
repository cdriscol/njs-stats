const REQUIRE_REGEX = /require+\([^\)]*\)(\.[^\)]*\))?/g;

module.exports = function countRequiresQ(code) {
    var matches = code.match(REQUIRE_REGEX);
    return Q.resolve(matches ? matches.length : 0);
};