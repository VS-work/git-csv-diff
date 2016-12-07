'use strict';

const _ = require('lodash');

const DIFF_STRUCTURE_UPDATED = {
  object: null,
  metadata: {
    file: {
      new: null,
      old: null
    },
    action: null,
    removedColumns: [],
    type: null,
    lang: null,
    onlyColumnsRemoved: false
  }
};

function modelDiffUpdated() {
  return {
    init: function() {
      return _.cloneDeep(DIFF_STRUCTURE_UPDATED);
    }
  };
};

module.exports = new modelDiffUpdated();