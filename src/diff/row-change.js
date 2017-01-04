'use strict';

const diffModifiers = require('./modifiers');

/* Declaration */

function diffRowChange() {};

/* API */

diffRowChange.prototype.getType = function () {
  return diffModifiers.CHANGE;
};

diffRowChange.prototype.process = function (modelResponse, modelDiff, diffResultColumns, rowValue) {
  console.log("Diff Change");
};

/* Export */

module.exports = new diffRowChange();