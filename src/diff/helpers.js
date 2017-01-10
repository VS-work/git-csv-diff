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


diffHelpers.prototype.isDatapointFile = function (filename) {
  return _.includes(filename, "--datapoints--");
};

diffHelpers.prototype.isLanguageFile = function (filename) {
  return _.includes(filename, "lang/");
};

/* Export */

module.exports = new diffHelpers();