'use strict';

const diffModifiers = require('./modifiers');

/* Declaration */

function diffHeaderUpdate() {};

/* API */

diffHeaderUpdate.prototype.getType = function () {
  return diffModifiers.COLUMN_UPDATE;
};

diffHeaderUpdate.prototype.process = function (modelResponse, modelDiff, diffResultColumns, rowValue) {
  console.log("Diff Header Update");
};

/* Export */

module.exports = new diffHeaderUpdate();