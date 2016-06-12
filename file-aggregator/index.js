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
            logger.info('finished globbing files, found', files.length, 'files');
            logger.log(files);
            resolve(files);
        });
    });
}

function getIgnoreGlob() {
    var gitIgnorePath = path.join(program.directory, '.gitignore');
    logger.log('using .gitignore from', gitIgnorePath);
    var glob = gitIgnoreToGlob(gitIgnorePath);
    glob = glob.map(function (item) {
        // removes "!" off globs, because glob's ignore option adds the "!" to the array items (me thinks)
        return item.substr(1);
    });

    if(!program.ignore) return glob;
    
    logger.log('processing ignore argument', program.ignore);
    program.ignore.split(',').forEach(dirName => {
       glob.push('**/' + dirName + '\r/**');
    });
    
    return glob;
}