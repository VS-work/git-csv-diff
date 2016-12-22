'use strict';

const _ = require('lodash');
const daff = require('daff');
const path = require('path');
const async = require("async");

const ModelDiff = require('./model-diff');
const ModelDiffUpdated = require('./model-diff-updated');

const constants = {
  DATAPOINTS: 'datapoints',
  CONCEPTS: 'concepts',
  ENTITIES: 'entities'
};

function diffByFileUpdated() {
  return {
    process: _process
  };
};

/* protected */

function _process(metaData, dataDiff, streams) {

  // metaData.fileName;
  // metaData.fileModifier;

  // dataDiff.from;
  // dataDiff.to;

  // streams.diff;
  // streams.lang;

  const isTranslations = isLanguageFile(metaData.fileName);
  const baseStream = isTranslations ? streams.lang : streams.diff;

  let diffResult = [];

  const tableFrom = new daff.Csv().makeTable(dataDiff.from);
  const tableTo = new daff.Csv().makeTable(dataDiff.to);

  let filesDiff = daff.compareTables(tableFrom, tableTo).align();

  let flags = new daff.CompareFlags();
  flags.show_unchanged = true;
  flags.show_unchanged_columns = true;
  flags.always_show_header = true;

  let highlighter = new daff.TableDiff(filesDiff, flags);
  highlighter.hilite(diffResult);

  /* Prepare Data Structure */
  let fileDiffData = ModelDiff.init();
  let modelDiff = ModelDiffUpdated.init();

  setMetaDataFile(modelDiff.metadata.file, metaData);
  if(!isSchemaExists(modelDiff.metadata)) {
    return;
  }

  if(!isValidFilePath(metaData.fileName)) {
    return;
  }

  setMetaDataType(modelDiff.metadata);
  setMetaDataLanguage(modelDiff.metadata, metaData.fileName);

  const primaryKeys = getPrimaryKeys(modelDiff.metadata);
  const primaryKey = _.first(primaryKeys);

  /* Slice Groupd of Changes */

  let firsDiffRow = diffResult.shift();
  let diffResultHeader = [];
  let diffResultColumns = [];

  if (firsDiffRow[0] == '!') {

    // [ '!', '', '(old_column)', '+++', '---' ],
    diffResultHeader = firsDiffRow;
    // [ '@@', 'city', 'name', 'country' ],
    diffResultColumns = diffResult.shift();

    if (diffResultHeader[0] == "!") {

      diffResultHeader.shift();
      diffResultHeader.forEach(function (value, index) {

        if (value != '') {

          if (value == '+++') {
            // added
            fileDiffData.header.create.push(diffResultColumns[index + 1]);
          } else if (value == '---') {
            // removed
            fileDiffData.header.remove.push(diffResultColumns[index + 1]);
          } else if (value === ':') {
            // re-ordered, skip it
          } else {
            // modified
            let oldColumn = value.substring(1, value.length - 1);
            let diffColumns = {};
            diffColumns[diffResultColumns[index + 1]] = oldColumn;
            fileDiffData.header.update.push(diffColumns);
            fileDiffData.header.remove.push(oldColumn);
          }
        }

      });
    }

  } else {
    // [ '@@', 'city', 'name', 'country' ],
    diffResultColumns = firsDiffRow;
  }

  // update `remove` section from header
  if (metaData.fileModifier != "D") {
    // clear remove header section for removed files
    modelDiff.metadata.removedColumns = _.clone(fileDiffData.header.remove);
  }

  let diffResultGidField;
  let indexGid = 0;
  if (diffResultColumns[0] == "@@") {
    diffResultColumns.shift();
    indexGid = diffResultColumns.indexOf(primaryKey);
    diffResultGidField = diffResultColumns[indexGid];
  }

  let isDataPointsFile = isDatapointFile(metaData.fileName);

  if (diffResult.length) {

    diffResult.forEach(function (value, index) {

      // simple-way, collect all data (mean full row) for update

      let modificationType = value.shift();

      if (modificationType != '') {

        if (modificationType == '+++') {

          // added
          let dataRow = {};
          diffResultColumns.forEach(function (columnValue, columnIndex) {
            if (fileDiffData.header.remove.indexOf(columnValue) == -1) {
              // ready columns
              dataRow[columnValue] = value[columnIndex];
            }
          });

          if (dataRow) {
            // fileDiffData.body.create.push(dataRow);
            modelDiff.metadata.action = 'create';
            modelDiff.object = dataRow;
            writeToStream(baseStream, modelDiff);
          }

        }
        else if (modificationType == '---') {

          // removed
          let dataRowRemoved = {};

          // check that file with datapoints
          if (isDataPointsFile) {
            diffResultColumns.forEach(function (columnValue, columnIndex) {
              if (
                // disable changes for removed files
              // fileDiffData.header.remove.indexOf(columnValue) == -1 &&
              fileDiffData.header.create.indexOf(columnValue) == -1
              ) {
                // ready columns
                dataRowRemoved[columnValue] = value[columnIndex];
              }
            });
          } else {
            dataRowRemoved['gid'] = diffResultGidField;
            dataRowRemoved[diffResultGidField] = value[indexGid];
          }

          // fileDiffData.body.remove.push(dataRowRemoved);
          modelDiff.metadata.action = 'remove';
          modelDiff.object = dataRowRemoved;
          writeToStream(baseStream, modelDiff);

        }
        else if (modificationType == '+') {

          // updated, only added columns
          let dataRow = {};
          let dataRowOrigin = {};
          diffResultHeader.forEach(function (columnValue, columnIndex) {
            let columnKey = diffResultColumns[columnIndex];
            if (fileDiffData.header.create.indexOf(columnKey) != -1) {
              dataRow[columnKey] = value[columnIndex];
            } else {
              dataRowOrigin[columnKey] = value[columnIndex];
            }
          });

          let dataRowUpdated = {};
          dataRowUpdated["gid"] = diffResultGidField;
          dataRowUpdated[diffResultGidField] = value[indexGid];
          dataRowUpdated["data-update"] = dataRow;

          if (isDataPointsFile) {
            dataRowUpdated["data-origin"] = dataRowOrigin;
          }

          // fileDiffData.body.update.push(dataRowUpdated);
          modelDiff.metadata.action = 'update';
          modelDiff.object = dataRowUpdated;
          writeToStream(baseStream, modelDiff);

        }
        else if (modificationType == '->') {

          // updated, only changed cell
          let dataRow = {};
          let dataRowLang = {};
          let dataRowOrigin = {};

          value.forEach(function (valueCell, indexCell) {
            let modificationSeparatorPosition = valueCell.indexOf('->');
            let columnKey = diffResultColumns[indexCell];

            // cell modified
            if (modificationSeparatorPosition !== -1) {
              let readyValueCell = valueCell.substring(modificationSeparatorPosition + 2);
              let readyValueCellOrigin = valueCell.substring(0, modificationSeparatorPosition);

              dataRow[columnKey] = readyValueCell;
              dataRowOrigin[columnKey] = readyValueCellOrigin;
              // collect all changes for translations anyway
              dataRowLang[columnKey] = readyValueCell;

            } else {

              if (isDataPointsFile) {
                if (fileDiffData.header.create.indexOf(columnKey) == -1) {
                  dataRowOrigin[columnKey] = valueCell;
                }
              }
              // check if not removed column
              if (fileDiffData.header.remove.indexOf(columnKey) === -1) {
                // collect all changes for translations anyway
                dataRowLang[columnKey] = valueCell;
                dataRow[columnKey] = valueCell;
              }
            }
          });

          // new Gid value
          let conceptValueSearchFor = value[indexGid];
          let conceptValueTypeIndex = conceptValueSearchFor.indexOf('->');
          let gidChangeDetection = (conceptValueTypeIndex != -1) ? true : false;

          // gid-column changed
          if (gidChangeDetection) {
            // old gid value
            conceptValueSearchFor = conceptValueSearchFor.substring(0, conceptValueTypeIndex);
          }

          let dataRowUpdated = {};
          dataRowUpdated["gid"] = diffResultGidField;
          dataRowUpdated[diffResultGidField] = conceptValueSearchFor;
          dataRowUpdated["data-update"] = dataRow;

          if (isDataPointsFile) {
            dataRowUpdated["data-origin"] = dataRowOrigin;
          }


          if(isTranslations && gidChangeDetection && !isDataPointsFile) {

            // custom flow for translations with changed gid (split `change` to `remove` + `create`)

            // `remove` action
            const dataRowRemoved = {};
            dataRowRemoved['gid'] = diffResultGidField;
            dataRowRemoved[diffResultGidField] = conceptValueSearchFor;

            modelDiff.metadata.action = 'remove';
            modelDiff.object = dataRowRemoved;
            writeToStream(baseStream, modelDiff);

            // `create` action
            modelDiff.metadata.action = 'create';
            modelDiff.object = dataRowLang;
            writeToStream(baseStream, modelDiff);

          } else {

            // default flow

            // fileDiffData.body.change.push(dataRowUpdated);
            modelDiff.metadata.action = 'change';
            modelDiff.object = dataRowUpdated;
            writeToStream(baseStream, modelDiff);
          }
        }
        // empty modifier symbol
      } else {
        // check that there is no new columns were added
        if (fileDiffData.header.create.length) {

          let dataRow = {};
          let dataRowOrigin = {};

          value.forEach(function (valueCell, indexCell) {
            let columnKey = diffResultColumns[indexCell];
            if (fileDiffData.header.create.indexOf(columnKey) == -1) {
              // check that file with datapoints
              if (isDataPointsFile) {
                // collect original values for datapoints
                dataRowOrigin[columnKey] = valueCell;
              }
            } else {
              // new values for added columns
              if (fileDiffData.header.remove.indexOf(columnKey) === -1) {
                dataRow[columnKey] = valueCell;
              }
            }
          });

          let dataRowChanged = {};
          dataRowChanged["gid"] = diffResultGidField;
          dataRowChanged[diffResultGidField] = value[indexGid];
          dataRowChanged["data-update"] = dataRow;

          if (isDataPointsFile) {
            dataRowChanged["data-origin"] = dataRowOrigin;
          }

          // fileDiffData.body.change.push(dataRowChanged);
          modelDiff.metadata.action = 'change';
          modelDiff.object = dataRowChanged;
          writeToStream(baseStream, modelDiff);
        }

        // check that there is no renamed columns
        if (fileDiffData.header.update.length) {

          let dataRow = {};
          let dataRowOrigin = {};

          // check that file with datapoints
          value.forEach(function (valueCell, indexCell) {
            let columnKey = diffResultColumns[indexCell];

            // not new column
            if (fileDiffData.header.create.indexOf(columnKey) == -1) {
              // is this changed column
              let columnKeyOld = columnKey;
              let oldColumnIndex = fileDiffData.header.update.findIndex(function (updateElement) {
                return !!updateElement[columnKey];
              });
              if (oldColumnIndex !== -1) {
                // get old column name
                columnKeyOld = fileDiffData.header.update[oldColumnIndex][columnKey];
              }

              if (fileDiffData.header.remove.indexOf(columnKey) === -1) {
                dataRow[columnKey] = valueCell;
              }

              if (isDataPointsFile) {
                dataRowOrigin[columnKeyOld] = valueCell;
              }
            } else {
              // new column
              if (fileDiffData.header.remove.indexOf(columnKey) === -1) {
                dataRow[columnKey] = valueCell;
              }
            }
          });

          let dataRowChanged = {};
          dataRowChanged["gid"] = diffResultGidField;
          dataRowChanged[diffResultGidField] = value[indexGid];
          dataRowChanged["data-update"] = dataRow;

          if (isDataPointsFile) {
            dataRowChanged["data-origin"] = dataRowOrigin;
          }

          // fileDiffData.body.change.push(dataRowChanged);
          modelDiff.metadata.action = 'change';
          modelDiff.object = dataRowChanged;
          writeToStream(baseStream, modelDiff);
        }

        // check that there is no removed columns
        if (fileDiffData.header.remove.length) {
          if(isDataPointsFile && isTranslations) {

            // updated, only changed cell
            let dataRow = {};
            let dataRowLang = {};
            let dataRowOrigin = {};

            value.forEach(function (valueCell, indexCell) {
              let columnKey = diffResultColumns[indexCell];
              if (fileDiffData.header.create.indexOf(columnKey) == -1) {
                dataRowOrigin[columnKey] = valueCell;
              }
              // check if not removed column
              if (fileDiffData.header.remove.indexOf(columnKey) === -1) {
                // collect all changes for translations anyway
                dataRowLang[columnKey] = valueCell;
                dataRow[columnKey] = valueCell;
              }
            });

            let conceptValueSearchFor = value[indexGid];

            let dataRowUpdated = {};
            dataRowUpdated["gid"] = diffResultGidField;
            dataRowUpdated[diffResultGidField] = conceptValueSearchFor;
            dataRowUpdated["data-update"] = dataRow;
            dataRowUpdated["data-origin"] = dataRowOrigin;

            // fileDiffData.body.change.push(dataRowUpdated);
            modelDiff.metadata.onlyColumnsRemoved = true;
            modelDiff.metadata.action = 'change';
            modelDiff.object = dataRowUpdated;
            writeToStream(baseStream, modelDiff);

          }
        }
      }
    });
  }

  return;
}

function isDatapointFile(filename) {
  return filename.indexOf("--datapoints--") !== -1 ? true : false;
}
function isLanguageFile(filename) {
  return filename.indexOf("lang/") !== -1 ? true : false;
}
function isValidFilePath(filename) {
  if(
    filename.indexOf("/") !== -1 &&
    !isLanguageFile(filename)
  ) {
    return false;
  }
  return true;
}

function setMetaDataLanguage(metaData, fileName) {
  let lang = 'default';
  if(isLanguageFile(fileName)) {
    const regexpRes = /lang\/(.+)\//.exec(fileName);
    lang = regexpRes[1] || lang;
  }
  metaData.lang = lang;
}
function setMetaDataFile(file, metaData) {

  const fileName = path.parse(metaData.fileName).base;

  const resourcesByPathOld = _.keyBy(metaData.datapackage.old.resources, 'path');
  file.old = resourcesByPathOld[fileName];

  // info is not available if file was removed
  if(metaData.fileModifier != "D") {
    const resourcesByPathNew = _.keyBy(metaData.datapackage.new.resources, 'path');
    file.new = resourcesByPathNew[fileName];
  }
}

function isSchemaExists(metadata) {
  const schemaSource = metadata.file.new ? metadata.file.new : metadata.file.old;
  return schemaSource && schemaSource.hasOwnProperty('schema');
}

function setMetaDataType(metadata) {
  const primaryKeys = getPrimaryKeys(metadata);

  if (primaryKeys.length > 1)
    return metadata.type = constants.DATAPOINTS;

  if (_.includes(constants.CONCEPTS, _.first(primaryKeys)))
    return metadata.type = constants.CONCEPTS;

  return metadata.type = constants.ENTITIES;
}

function getPrimaryKeys(metadata) {
  // detect schema from `old` file if it was removed and not exists in `new`
  const schemaSource = metadata.file.new ? metadata.file.new : metadata.file.old;
  const primaryKeyRaw = _.clone(schemaSource.schema.primaryKey);

  return _.isString(primaryKeyRaw) ? [primaryKeyRaw] : primaryKeyRaw;
}

function writeToStream(stream, model) {
  let modelString = JSON.stringify(model);
  stream.write(modelString + "\r\n");
}

module.exports = new diffByFileUpdated();