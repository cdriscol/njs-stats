var glob = require("glob");
var path = require('path');
var gitIgnoreToGlob = require('gitignore-to-glob');

module.exports = {
    findAllFilesQ: findAllFilesQ
};

function findAllFilesQ() {
    logger.log('finding all files in ' + program.directory);
    return new Promise(function (resolve, reject) {
        glob('**/*.js', {
            ignore: getIgnoreGlob(),
            cwd: program.directory
        }, function (err, files) {
            if(err) return reject(err);
            logger.info('Finished globbing files, found ' + files.length + ' files');
            logger.log(files);
            resolve(files);
        });
    });
}

function getIgnoreGlob() {
    var gitIgnorePath = path.join(program.directory, '.gitignore');
    logger.log('using .gitignore from ' + gitIgnorePath);
    var glob = gitIgnoreToGlob(gitIgnorePath);
    // removes "!" off globs, because glob's ignore option adds the "!" to the array items (me thinks)
    glob = glob.map(function (item) {
        return item.substr(1);
    });
    return glob;
}