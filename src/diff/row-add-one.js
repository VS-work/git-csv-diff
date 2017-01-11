'use strict';

const _ = require('lodash');

const diffModifiers = require('./modifiers');
const diffHelpers = require('./helpers');

/* Declaration */

function diffRowAddOne() {}

/* API */

diffRowAddOne.prototype.getType = function () {
  return diffModifiers.ADD_ONE;
};

diffRowAddOne.prototype.process = function (baseStream, metaData, modelResponse, modelDiff, diffResultColumns, rowValue) {

  const dataRow = {};
  const dataRowOrigin = {};

  const primaryKeys = diffHelpers.getPrimaryKeys(modelResponse.metadata);
  const primaryKey = _.first(primaryKeys);
  const primaryKeyIndex = diffResultColumns.indexOf(primaryKey);

  const isDataPointsFile = diffHelpers.isDatapointFile(metaData.fileName);

  diffResultColumns.forEach(function (columnValue, columnIndex) {
    if(diffHelpers.isColumnCreated(modelDiff, columnValue)) {
      dataRow[columnValue] = rowValue[columnIndex];
    } else {
      dataRowOrigin[columnValue] = rowValue[columnIndex];
    }
  });

  const dataRowUpdated = {};
  dataRowUpdated["gid"] = primaryKey;
  dataRowUpdated[primaryKey] = rowValue[primaryKeyIndex];
  dataRowUpdated["data-update"] = dataRow;

  if (isDataPointsFile) {
    dataRowUpdated["data-origin"] = dataRowOrigin;
  }

  modelResponse.metadata.action = 'update';
  modelResponse.object = dataRowUpdated;

  diffHelpers.writeToStream(baseStream, modelResponse);
};

/* Export */

module.exports = new diffRowAddOne();