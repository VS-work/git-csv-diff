'use strict';

/*

  Spec: http://share.find.coop/doc/spec_hilite.html

  Action column:

    @@      the header tag marks a header row, if one exists.
    +++     the insert tag marks an added row (present in R, not present in L).
    ---     the delete tag marks a removed row (present in L, not present in R).
    ->      the update tag marks a row in which at least one cell changed. -->, --->, ----> etc. have the same meaning.
    Blank   A blank string or NULL marks a row common to L and R.
    ...     the skip tag marks that rows common to L and R are being skipped.
    !       The schema tag marks a change in the sheet structure.

  Data columns:

    @@      cells contain column names.
    +++     cells shown are from R, and not present in L.
    ---     cells shown are from L, and not present in R.
    ->      cells shown are common to both L and R. When L and R cells differ, a compound "Vl->Vr" cell is shown.
    Blank   cells shown are common to both L and R.
    ...     skipping rows common to both L and R.

*/

/* Export */

module.exports = {
  // default types
  HEADER: '@@',
  ADD: '+++',
  REMOVE: '---',
  CHANGE: '->',
  BLANK: '',
  SKIP: '...',
  STRUCTURE: '!',
  REORDER: ':',
  ADD_ONE: '+',
  // external types
  COLUMN_CREATE: 'COLUMN_CREATE',
  COLUMN_REMOVE: 'COLUMN_REMOVE',
  COLUMN_UPDATE: 'COLUMN_UPDATE'
};