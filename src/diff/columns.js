'use strict';

const _ = require('lodash');
const diffModifiers = require('./modifiers');

/* Declaration */

function diffColumns() {};

/* API */

diffColumns.prototype.process = function (diffResult, modelDiff) {

  const diffColumnsRow = diffResult.shift();
  const diffColumnsRowType = diffColumnsRow.shift();

  // Not Structure Changes

  if (diffColumnsRowType !== diffModifiers.STRUCTURE) {
    // [ '@@', 'city', 'name', 'country' ]
    return diffColumnsRow;
  }

  // Otherwise, Structure changes:
  // diffColumnsRow, like: [ '!', '', '(old_column)', '+++', '---' ]

  // slice next row, that contain: [ '@@', 'city', 'name', 'country' ]
  const diffColumnsRowColumns = diffResult.shift();
  // slice modifier "@@"
  diffColumnsRowColumns.shift();

  // Handle Changes
  diffColumnsRow.forEach(function (value, index) {
    if (value !== diffModifiers.BLANK) {

      // added
      if (value === diffModifiers.ADD) {
        modelDiff.header.create.push(diffColumnsRowColumns[index + 1]);

      // removed
      } else if (value === diffModifiers.REMOVE) {
        modelDiff.header.remove.push(diffColumnsRowColumns[index + 1]);

      // reorder (skip)
      } else if (value === diffModifiers.REORDER) {

      // modified
      } else {
        const oldColumn = value.substring(1, value.length - 1);
        const diffColumns = {};
        diffColumns[diffColumnsRowColumns[index + 1]] = oldColumn;

        modelDiff.header.update.push(diffColumns);
        modelDiff.header.remove.push(oldColumn);
      }
    }
  });

  return diffColumnsRowColumns;
};

/* Export */

module.exports = new diffColumns();