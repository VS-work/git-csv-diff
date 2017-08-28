'use strict';

const _ = require('lodash');

const diffModifiers = require('./modifiers');
const diffHelpers = require('./helpers');

/* Declaration */

function diffHeaderRemove() {}

/* API */

diffHeaderRemove.prototype.getType = function () {
  return diffModifiers.COLUMN_REMOVE;
};

diffHeaderRemove.prototype.process = function (baseStream, metaData, modelResponse, modelDiff, diffResultColumns, rowValue) {

  const primaryKeys = diffHelpers.getPrimaryKeys(modelResponse.metadata);
  const primaryKey = _.first(primaryKeys);
  const primaryKeyIndex = diffResultColumns.indexOf(primaryKey);

  const isTranslations = diffHelpers.isLanguageFile(metaData.fileName);
  const isDataPointsFile = diffHelpers.isDatapointFile(modelResponse.metadata, metaData);

  if(isDataPointsFile && isTranslations) {

    const dataRow = {};
    const dataRowLang = {};
    const dataRowOrigin = {};

    rowValue.forEach(function (valueCell, indexCell) {
      const columnValue = diffResultColumns[indexCell];
      if(!diffHelpers.isColumnCreated(modelDiff, columnValue)) {
        dataRowOrigin[columnValue] = valueCell;
      }
      // check if not removed column
      if(!diffHelpers.isColumnRemoved(modelDiff, columnValue)) {
        // collect all changes for translations anyway
        dataRowLang[columnValue] = valueCell;
        dataRow[columnValue] = valueCell;
      }
    });

    const dataRowUpdated = {};
    dataRowUpdated["gid"] = primaryKey;
    dataRowUpdated[primaryKey] = rowValue[primaryKeyIndex];
    dataRowUpdated["data-update"] = dataRow;
    dataRowUpdated["data-origin"] = dataRowOrigin;

    modelResponse.metadata.onlyColumnsRemoved = true;
    modelResponse.metadata.action = 'change';
    modelResponse.object = dataRowUpdated;

    diffHelpers.writeToStream(baseStream, modelResponse);
  }
};

/* Export */

module.exports = new diffHeaderRemove();
