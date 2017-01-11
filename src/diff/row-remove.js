'use strict';

const _ = require('lodash');

const diffModifiers = require('./modifiers');
const diffHelpers = require('./helpers');

/* Declaration */

function diffRowRemove() {}

/* API */

diffRowRemove.prototype.getType = function () {
  return diffModifiers.REMOVE;
};

diffRowRemove.prototype.process = function (baseStream, metaData, modelResponse, modelDiff, diffResultColumns, rowValue) {

  const dataRow = {};
  const isDataPointsFile = diffHelpers.isDatapointFile(metaData.fileName);

  const primaryKeys = diffHelpers.getPrimaryKeys(modelResponse.metadata);
  const primaryKey = _.first(primaryKeys);
  const primaryKeyIndex = diffResultColumns.indexOf(primaryKey);

  // check that file with datapoints
  if (isDataPointsFile) {
    diffResultColumns.forEach(function (columnValue, columnIndex) {
      if(!diffHelpers.isColumnCreated(modelDiff, columnValue)) {
        // ready columns
        dataRow[columnValue] = rowValue[columnIndex];
      }
    });
  } else {
    dataRow['gid'] = primaryKey;
    dataRow[primaryKey] = rowValue[primaryKeyIndex];
  }

  modelResponse.metadata.action = 'remove';
  modelResponse.object = dataRow;

  diffHelpers.writeToStream(baseStream, modelResponse);
};

/* Export */

module.exports = new diffRowRemove();