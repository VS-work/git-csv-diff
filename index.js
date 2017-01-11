'use strict';

const diffByFile = require('./src/diff-by-file');

/* Declaration */

function gitCsvDiff() {}

/* API */

gitCsvDiff.prototype.process = function (metaData, dataDiff, streams, callback) {
  return callback(diffByFile.process(metaData, dataDiff, streams));
};

// Alias :: backward compatibility

gitCsvDiff.prototype.processUpdated = gitCsvDiff.prototype.process;

/* Export */

module.exports = new gitCsvDiff();