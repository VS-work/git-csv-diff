'use strict';

const diffModifiers = require('./modifiers');

/* Declaration */

function diffRowAddOne() {};

/* API */

diffRowAddOne.prototype.getType = function () {
  return diffModifiers.ADD_ONE;
};

diffRowAddOne.prototype.process = function (modelResponse, modelDiff, diffResultColumns, rowValue) {
  console.log("Add One");
};

/* Export */

module.exports = new diffRowAddOne();