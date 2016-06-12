var sloc = require('sloc');

module.exports = function calcLocDataQ(code) {
    var locData = sloc(code, 'js');
    return Q.resolve(locData);
};