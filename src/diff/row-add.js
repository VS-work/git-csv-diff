'use strict';

const diffModifiers = require('./modifiers');
const diffHelpers = require('./helpers');

/* Declaration */

function diffRowAdd() {}

/* API */

diffRowAdd.prototype.getType = function () {
  return diffModifiers.ADD;
};

diffRowAdd.prototype.process = function (baseStream, metaData, modelResponse, modelDiff, diffResultColumns, rowValue) {

  const dataRow = {};

  diffResultColumns.forEach(function (columnValue, columnIndex) {
    if(!diffHelpers.isColumnRemoved(modelDiff, columnValue)) {
      // ready columns
      dataRow[columnValue] = rowValue[columnIndex];
    }
  });

  if (dataRow) {
    modelResponse.metadata.action = 'create';
    modelResponse.object = dataRow;

    diffHelpers.writeToStream(baseStream, modelResponse);
  }
};

/* Export */

module.exports = new diffRowAdd();