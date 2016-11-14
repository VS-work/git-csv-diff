'use strict';

const _ = require('lodash');

const DIFF_STRUCTURE_UPDATED = {
  object: {
    /* object with structure from old diff */
  },
  metadata: {
    filename: false,
    action: false,
    remove: []
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