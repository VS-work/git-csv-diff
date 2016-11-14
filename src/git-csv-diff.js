'use strict';

const daff = require('daff');
const _ = require('lodash');
const async = require("async");

const diffByFile = require('./diff-by-file');
const diffByFileUpdated = require('./diff-by-file-updated');

function gitCsvDiff() {
};

/* API */

gitCsvDiff.prototype.process = function (fileName, result, fileModifier, callback) {
  return callback(false, diffByFile.process(fileName, result, fileModifier));
};

gitCsvDiff.prototype.processUpdated = function (metaData, dataDiff, streams, callback) {
  return callback(diffByFileUpdated.process(metaData, dataDiff, streams));
};

module.exports = new gitCsvDiff();
