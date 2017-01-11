'use strict';

const _ = require('lodash');

const MODEL_RESPONSE = {
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

function modelResponse() {
  return {
    init: function() {
      return _.cloneDeep(MODEL_RESPONSE);
    }
  };
};

module.exports = new modelResponse();