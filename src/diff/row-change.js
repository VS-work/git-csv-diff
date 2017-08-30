'use strict';

const _ = require('lodash');

const diffModifiers = require('./modifiers');
const diffHelpers = require('./helpers');

/* Declaration */

function diffRowChange() {}

/* API */

diffRowChange.prototype.getType = function () {
  return diffModifiers.CHANGE;
};

diffRowChange.prototype.process = function (baseStream, metaData, modelResponse, modelDiff, diffResultColumns, rowValue) {

  const dataRow = {};
  const dataRowLang = {};
  const dataRowOrigin = {};

  const primaryKeys = diffHelpers.getPrimaryKeys(modelResponse.metadata);
  const primaryKey = _.first(primaryKeys);
  const primaryKeyIndex = diffResultColumns.indexOf(primaryKey);

  const isDataPointsFile = diffHelpers.isDatapointFile({lang: modelResponse.metadata.lang, fileName: metaData.fileName, primaryKeyByPath: metaData.primaryKeyByPath});
  const isTranslations = diffHelpers.isLanguageFile(metaData.fileName);

  rowValue.forEach(function (valueCell, indexCell) {

    const modificationSeparatorPosition = typeof valueCell === 'undefined' ? -1 : valueCell.indexOf('->');
    const columnValue = diffResultColumns[indexCell];

    // cell modified
    if (modificationSeparatorPosition !== -1) {

      const readyValueCell = valueCell.substring(modificationSeparatorPosition + 2);
      const readyValueCellOrigin = valueCell.substring(0, modificationSeparatorPosition);

      dataRow[columnValue] = readyValueCell;
      dataRowOrigin[columnValue] = readyValueCellOrigin;
      // collect all changes for translations anyway
      dataRowLang[columnValue] = readyValueCell;

    } else {

      if(!diffHelpers.isColumnCreated(modelDiff, columnValue)) {
        dataRowOrigin[columnValue] = valueCell;
      }
      // check if not removed column
      if(!diffHelpers.isColumnRemoved(modelDiff, columnValue)) {
        // collect all changes for translations anyway
        dataRowLang[columnValue] = valueCell;
        dataRow[columnValue] = valueCell;
      }
    }
  });

  // new Gid value
  let conceptValueSearchFor = rowValue[primaryKeyIndex];
  let conceptValueTypeIndex = conceptValueSearchFor.indexOf('->');
  let gidChangeDetection = (conceptValueTypeIndex != -1) ? true : false;

  // gid-column changed
  if (gidChangeDetection) {
    // old gid value
    conceptValueSearchFor = conceptValueSearchFor.substring(0, conceptValueTypeIndex);
  }

  let dataRowUpdated = {};
  dataRowUpdated["gid"] = primaryKey;
  dataRowUpdated[primaryKey] = conceptValueSearchFor;
  dataRowUpdated["data-update"] = dataRow;
  dataRowUpdated["data-origin"] = dataRowOrigin;
  // custom flow for translations with changed gid (split `change` to `remove` + `create`)

  if(isTranslations && gidChangeDetection && !isDataPointsFile) {
    // `remove` action
    const dataRowRemoved = {};
    dataRowRemoved['gid'] = primaryKey;
    dataRowRemoved[primaryKey] = conceptValueSearchFor;
    dataRowRemoved["data-origin"] = dataRowOrigin;

    modelResponse.metadata.action = 'remove';
    modelResponse.object = dataRowRemoved;
    diffHelpers.writeToStream(baseStream, modelResponse);

    // `create` action
    const modelResponseSecond = _.cloneDeep(modelResponse);
    modelResponseSecond.metadata.action = 'create';
    modelResponseSecond.object = dataRowLang;
    diffHelpers.writeToStream(baseStream, modelResponseSecond);

  } else {
    // default flow
    modelResponse.metadata.action = 'change';
    modelResponse.object = dataRowUpdated;
    diffHelpers.writeToStream(baseStream, modelResponse);
  }
};

/* Export */

module.exports = new diffRowChange();
