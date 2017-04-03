'use strict';

const _ = require('lodash');

const diffModifiers = require('./modifiers');
const diffHelpers = require('./helpers');

/* Declaration */

function diffHeaderCreate() {}

/* API */

diffHeaderCreate.prototype.getType = function () {
  return diffModifiers.COLUMN_CREATE;
};

diffHeaderCreate.prototype.process = function (baseStream, metaData, modelResponse, modelDiff, diffResultColumns, rowValue) {

  const dataRow = {};
  const dataRowOrigin = {};

  const primaryKeys = diffHelpers.getPrimaryKeys(modelResponse.metadata);
  const primaryKey = _.first(primaryKeys);
  const primaryKeyIndex = diffResultColumns.indexOf(primaryKey);

  rowValue.forEach(function (valueCell, indexCell) {
    const columnValue = diffResultColumns[indexCell];

    if(!diffHelpers.isColumnCreated(modelDiff, columnValue)) {
      // collect original values
      dataRowOrigin[columnValue] = valueCell;
    } else {
      // new values for added columns
      dataRow[columnValue] = valueCell;
    }
  });

  const dataRowChanged = {};
  dataRowChanged["gid"] = primaryKey;
  dataRowChanged[primaryKey] = rowValue[primaryKeyIndex];
  dataRowChanged["data-update"] = dataRow;
  dataRowChanged["data-origin"] = dataRowOrigin;

  modelResponse.metadata.action = 'change';
  modelResponse.object = dataRowChanged;
  diffHelpers.writeToStream(baseStream, modelResponse);
};

/* Export */

module.exports = new diffHeaderCreate();
