'use strict';

const _ = require('lodash');

/* Declaration */

function diffHelpers() {
}
/* API */

diffHelpers.prototype.getPrimaryKeys = function (metadataModel) {
  // detect schema from `old` file if it was removed and not exists in `new`
  const schemaSource = metadataModel.file.new ? metadataModel.file.new : metadataModel.file.old;
  const primaryKeyRaw = _.clone(_.get(schemaSource, 'schema.primaryKey', null));

  return _.isString(primaryKeyRaw) ? [primaryKeyRaw] : primaryKeyRaw;
};


diffHelpers.prototype.isDatapointFile = function (metadata) {
  const fileName = this.getOriginalFileName(metadata.fileName, metadata.lang);

  const primaryKeyByPath = _.get(metadata, 'primaryKeyByPath');
  const newPrimaryKey = _.get(primaryKeyByPath, ['new', fileName]);
  const oldPrimaryKey = _.get(primaryKeyByPath, ['old', fileName]);

  const primaryKey = newPrimaryKey || oldPrimaryKey;
  return _.isArray(primaryKey) && primaryKey.length > 1;
};

diffHelpers.prototype.getOriginalFileName = function (fileName, lang) {
  if (this.isLanguageFile(fileName))
    return _.replace(fileName, `lang/${lang}/`, '');
  return fileName;
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
