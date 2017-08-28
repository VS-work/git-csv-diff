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
  const isDataPointsFile = diffHelpers.isDatapointFile(modelResponse.metadata, metaData);

  const primaryKey = _.first(diffHelpers.getPrimaryKeys(modelResponse.metadata));
  const primaryKeyIndex = _.indexOf(diffResultColumns, primaryKey);

  modelResponse.metadata.action = 'remove';
  modelResponse.object = getDataRow({
    diffResultColumns,
    rowValue,
    modelDiff,
    primaryKeyIndex,
    primaryKey,
    isDataPointsFile
  });

  diffHelpers.writeToStream(baseStream, modelResponse);
};

function getDataRow(options) {
  const { primaryKey, isDataPointsFile, primaryKeyIndex, rowValue } = options;

  if (isDataPointsFile) {
    return getRowWithColumnsFrom(options);
  }

  return {
    gid: primaryKey,
    [primaryKey]: rowValue[primaryKeyIndex],
    'data-origin': getRowWithColumnsFrom(options)
  };
}

function getRowWithColumnsFrom(options) {
  const { diffResultColumns, modelDiff, rowValue } = options;

  return diffResultColumns.reduce(function (result, columnValue, columnIndex) {
      if (!diffHelpers.isColumnCreated(modelDiff, columnValue)) {
        result[columnValue] = rowValue[columnIndex];
      }
      return result;
  }, {});
}

/* Export */

module.exports = new diffRowRemove();
