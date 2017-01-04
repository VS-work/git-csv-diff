'use strict';

const diffModifiers = require('./modifiers');

/* Declaration */

function diffHeaderCreate() {};

/* API */

diffHeaderCreate.prototype.getType = function () {
  return diffModifiers.COLUMN_CREATE;
};

diffHeaderCreate.prototype.process = function (modelResponse, modelDiff, diffResultColumns, rowValue) {
  console.log("Diff Header Create");
};

/* Export */

module.exports = new diffHeaderCreate();