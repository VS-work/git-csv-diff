'use strict';

const diffModifiers = require('./modifiers');

/* Declaration */

function diffHeaderRemove() {};

/* API */

diffHeaderRemove.prototype.getType = function () {
  return diffModifiers.COLUMN_REMOVE;
};

diffHeaderRemove.prototype.process = function (modelResponse, modelDiff, diffResultColumns, rowValue) {
  console.log("Diff Header Remove");
};

/* Export */

module.exports = new diffHeaderRemove();