'use strict';

const _ = require('lodash');

const MODEL_DIFF = {
  header: {
    create: [],
    remove: [],
    update: []
  },
  body: {
    create: [],
    remove: [],
    update: [],
    change: [],

    translate: {
      create: [],
      remove: [],
      update: [],
      change: []
    }
  }
};

function modelDiff() {
  return {
    init: function() {
      return _.cloneDeep(MODEL_DIFF);
    }
  };
};


module.exports = new modelDiff();