'use strict';

const diffRowAdd = require('./row-add');
const diffRowRemove = require('./row-remove');
const diffRowAddOne = require('./row-add-one');
const diffRowChange = require('./row-change');
const diffHeadCreate = require('./header-create');
const diffHeadUpdate = require('./header-update');
const diffHeadRemove = require('./header-remove');

/* Declaration */

function diffStrategy() {
  this._strategies = {};
  // setup available strategies
  this._strategies[diffRowAdd.getType()] = diffRowAdd;
  this._strategies[diffRowRemove.getType()] = diffRowRemove;
  this._strategies[diffRowAddOne.getType()] = diffRowAddOne;
  this._strategies[diffRowChange.getType()] = diffRowChange;
  this._strategies[diffHeadCreate.getType()] = diffHeadCreate;
  this._strategies[diffHeadUpdate.getType()] = diffHeadUpdate;
  this._strategies[diffHeadRemove.getType()] = diffHeadRemove;
};

/* API */

diffStrategy.prototype.get = function (type) {
  if(this.has(type)) {
    return this._strategies[type];
  }
  console.error(`Error: diffStrategy with type "${type}" is not defined`);
  return false;
};

diffStrategy.prototype.has = function (type) {
  return this._strategies.hasOwnProperty(type);
};

/* Export */

module.exports = new diffStrategy();