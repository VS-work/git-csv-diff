'use strict';

const _ = require('lodash');

/* Declaration */

function diffHelpers() {
}
/* API */

diffHelpers.prototype.getPrimaryKeys = function (metadata) {
  // detect schema from `old` file if it was removed and not exists in `new`
  const schemaSource = metadata.file.new ? metadata.file.new : metadata.file.old;
  const primaryKeyRaw = _.clone(schemaSource.schema.primaryKey);

  return _.isString(primaryKeyRaw) ? [primaryKeyRaw] : primaryKeyRaw;
};


diffHelpers.prototype.isDatapointFile = function (metadata) {
  const fileName = this.isLanguageFile(metadata.fileName) ? _.last(_.split(metadata.fileName, '/')) : metadata.fileName;

  const primaryKeyByPath = _.get(metadata, 'primaryKeyByPath');
  const newPrimaryKey = _.get(primaryKeyByPath, ['new', fileName]);
  const oldPrimaryKey = _.get(primaryKeyByPath, ['old', fileName]);

  const primaryKey = newPrimaryKey || oldPrimaryKey;
  return _.isArray(primaryKey) && primaryKey.length > 1;
};

diffHelpers.prototype.isLanguageFile = function (filename) {
  return _.includes(filename, "lang/");
};

diffHelpers.prototype.writeToStream = function (stream, model) {
  const modelString = JSON.stringify(model);
  stream.write(modelString + "\r\n");
};

/* detect structure changes */

diffHelpers.prototype.isColumnRemoved = function (modelDiff, columnValue) {
  return _.includes(modelDiff.header.remove, columnValue);
};

diffHelpers.prototype.isColumnCreated = function (modelDiff, columnValue) {
  return _.includes(modelDiff.header.create, columnValue);
};

/* Export */

module.exports = new diffHelpers();
