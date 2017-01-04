'use strict';

const diffModifiers = require('./modifiers');

/* Declaration */

function diffRowAdd() {};

/* API */

diffRowAdd.prototype.getType = function () {
  return diffModifiers.ADD;
};

diffRowAdd.prototype.process = function (modelResponse, modelDiff, diffResultColumns, rowValue) {
  console.log("Diff Add");
};

/* Export */

module.exports = new diffRowAdd();