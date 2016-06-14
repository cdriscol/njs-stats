module.exports = function specCountQ(fileName) {
  return new Promise(function (resolve) {
    if(fileName.indexOf(program.specPattern) > -1) return resolve(1);

    if(program.specDirectories) {
      program.specDirectories.split(',').forEach(specDir => {
        if(fileName.indexOf(specDir) > -1) return resolve(1);
      });
    }

    return resolve(0);
  });
};