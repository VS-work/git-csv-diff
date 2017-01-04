'use strict';

const diffModifiers = require('./modifiers');

/* Declaration */

function diffRowRemove() {};

/* API */

diffRowRemove.prototype.getType = function () {
  return diffModifiers.REMOVE;
};

diffRowRemove.prototype.process = function (modelResponse, modelDiff, diffResultColumns, rowValue) {
  console.log("Diff Remove");
};

/* Export */

module.exports = new diffRowRemove();