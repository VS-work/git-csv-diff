'use strict';

const _ = require('lodash');

const diffModifiers = require('./modifiers');
const diffHelpers = require('./helpers');

/* Declaration */

function diffHeaderUpdate() {}

/* API */

diffHeaderUpdate.prototype.getType = function () {
  return diffModifiers.COLUMN_UPDATE;
};

diffHeaderUpdate.prototype.process = function (baseStream, metaData, modelResponse, modelDiff, diffResultColumns, rowValue) {

  const dataRow = {};
  const dataRowOrigin = {};

  const primaryKeys = diffHelpers.getPrimaryKeys(modelResponse.metadata);
  const primaryKey = _.first(primaryKeys);
  const primaryKeyIndex = diffResultColumns.indexOf(primaryKey);

  const isDataPointsFile = diffHelpers.isDatapointFile(metaData.fileName);

  rowValue.forEach(function (valueCell, indexCell) {
    const columnValue = diffResultColumns[indexCell];

    // not new column
    if(!diffHelpers.isColumnCreated(modelDiff, columnValue)) {

      let columnValueOld = _.find(modelDiff.header.update, function(updateItem) {
        return updateItem.hasOwnProperty(columnValue);
      });
      // is this changed column or take base column value
      columnValueOld = !columnValueOld ? columnValue : columnValueOld[columnValue];

      if(!diffHelpers.isColumnRemoved(modelDiff, columnValue)) {
        dataRow[columnValue] = valueCell;
      }

      if (isDataPointsFile) {
        dataRowOrigin[columnValueOld] = valueCell;
      }
    } else {
      // and not removed
      if(!diffHelpers.isColumnRemoved(modelDiff, columnValue)) {
        dataRow[columnValue] = valueCell;
      }
    }
  });

  const dataRowChanged = {};
  dataRowChanged["gid"] = primaryKey;
  dataRowChanged[primaryKey] = rowValue[primaryKeyIndex];
  dataRowChanged["data-update"] = dataRow;

  if (isDataPointsFile) {
    dataRowChanged["data-origin"] = dataRowOrigin;
  }

  modelResponse.metadata.action = 'change';
  modelResponse.object = dataRowChanged;

  diffHelpers.writeToStream(baseStream, modelResponse);
};

/* Export */

module.exports = new diffHeaderUpdate();