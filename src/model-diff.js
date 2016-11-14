'use strict';

const _ = require('lodash');

const DIFF_STRUCTURE = {
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
      return _.cloneDeep(DIFF_STRUCTURE);
    }
  };
};


module.exports = new modelDiff();