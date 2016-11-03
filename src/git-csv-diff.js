'use strict';

const daff = require('daff');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const async = require("async");
const gitFlow = require('./git-flow');

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

function gitCsvDiff() {};

gitCsvDiff.prototype.process = function (data, callback) {

  const sourceFolderPath = path.resolve(data.sourceFolder) + "/";
  const resultToFile = data.resultToFile ? true : false;
  const translations = data.translations ? true : false;

  let dataRequest = {};
  let gitDiffFileStatus = {};

  gitFlow.setSourceFolder(sourceFolderPath);
  gitFlow.getFileDiffByHashes(data, gitDiffFileStatus, function (error, gitDiffFileList) {

    if (!!error) {
      return callback(error);
    }

    async.mapSeries(
      gitDiffFileList,
      // iteration
      function (fileName, doneMapLimit) {

        gitFlow.showFileStateByHash(data, fileName, function (error, result) {
          getDiffByFile(fileName, result);
          return doneMapLimit(error);
        });

      },
      // callback
      function (error) {

        if (!!error) {
          return callback(error);
        }

        let result = {
          'files': gitDiffFileStatus,
          'changes': dataRequest
        };

        // additional option
        if (translations) {
          generateTranslations(result);
        }

        // additional option
        if (resultToFile) {
          const resultFileName = getFileNameResult(sourceFolderPath, data.github);
          result['path'] = resultFileName;
          fs.writeFileSync(resultFileName, JSON.stringify(result));
        }

        //console.log("* Diff generation completed!");
        return callback(false, result);
      }
    );

  });

  function getDiffByFile(fileName, dataDiff) {

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

    //let fileDiffJSON = sourceFolderPath + "diff--" + fileName + ".json";
    //fs.writeFileSync(fileDiffJSON, JSON.stringify(diffResult));

    /* Prepare Data Structure */
    let fileDiffData = _.cloneDeep(DIFF_STRUCTURE);

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

    let diffResultGidField;
    if (diffResultColumns[0] == "@@") {
      diffResultColumns.shift();
      diffResultGidField = diffResultColumns[0];
    }

    let isDataPointsFile = isDatapointFile(fileName);

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
              fileDiffData.body.create.push(dataRow);
            }

          } else if (modificationType == '---') {

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
              dataRowRemoved[diffResultGidField] = value[0];
            }

            fileDiffData.body.remove.push(dataRowRemoved);

          } else if (modificationType == '+') {

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
            dataRowUpdated[diffResultGidField] = value[0];
            dataRowUpdated["data-update"] = dataRow;

            if (isDataPointsFile) {
              dataRowUpdated["data-origin"] = dataRowOrigin;
            }

            fileDiffData.body.update.push(dataRowUpdated);

          } else if (modificationType == '->') {

            // updated, only changed cell
            let dataRow = {};
            let dataRowOrigin = {};

            value.forEach(function (valueCell, indexCell) {
              let modificationSeparatorPosition = valueCell.indexOf('->');
              let columnKey = diffResultColumns[indexCell];

              // cell modified
              if (modificationSeparatorPosition != -1) {

                let readyValueCell = valueCell.substring(modificationSeparatorPosition + 2);
                let readyValueCellOrigin = valueCell.substring(0, modificationSeparatorPosition);

                dataRow[columnKey] = readyValueCell;
                dataRowOrigin[columnKey] = readyValueCellOrigin;

              } else if (isDataPointsFile) {
                dataRow[columnKey] = valueCell;
                if (fileDiffData.header.create.indexOf(columnKey) == -1) {
                  dataRowOrigin[columnKey] = valueCell;
                }
                // check that it's not new column
              } else if (fileDiffData.header.create.indexOf(columnKey) != -1) {
                dataRow[columnKey] = valueCell;
              }
            });

            // fix first column changes

            let conceptValueSearchFor = value[0];
            let conceptValueTypeIndex = conceptValueSearchFor.indexOf('->');

            if (conceptValueTypeIndex != -1) {
              conceptValueSearchFor = value[0].substring(0, conceptValueTypeIndex)
            }

            let dataRowUpdated = {};
            dataRowUpdated["gid"] = diffResultGidField;
            dataRowUpdated[diffResultGidField] = conceptValueSearchFor;
            dataRowUpdated["data-update"] = dataRow;

            if (isDataPointsFile) {
              dataRowUpdated["data-origin"] = dataRowOrigin;
            }

            fileDiffData.body.change.push(dataRowUpdated);
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
                dataRow[columnKey] = valueCell;
              }
            });

            let dataRowChanged = {};
            dataRowChanged["gid"] = diffResultGidField;
            dataRowChanged[diffResultGidField] = value[0];
            dataRowChanged["data-update"] = dataRow;

            if (isDataPointsFile) {
              dataRowChanged["data-origin"] = dataRowOrigin;
            }

            fileDiffData.body.change.push(dataRowChanged);
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

                dataRow[columnKey] = valueCell;
                if (isDataPointsFile) {
                  dataRowOrigin[columnKeyOld] = valueCell;
                }
              } else {
                // new column
                dataRow[columnKey] = valueCell;
              }
            });

            let dataRowChanged = {};
            dataRowChanged["gid"] = diffResultGidField;
            dataRowChanged[diffResultGidField] = value[0];
            dataRowChanged["data-update"] = dataRow;

            if (isDataPointsFile) {
              dataRowChanged["data-origin"] = dataRowOrigin;
            }

            fileDiffData.body.change.push(dataRowChanged);
          }
        }
      });
    }

    // clear remove header section for removed files
    if (gitDiffFileStatus[fileName] == "D") {
      fileDiffData.header.remove = [];
    }

    // Structure :: Create

    dataRequest[fileName] = fileDiffData;
    //console.log("+ " + fileName + ".json");

    //fs.writeFileSync(sourceFolderPath + fileName + ".json", JSON.stringify(fileDiffData));
  };

  function generateTranslations(resultDiff) {

    if (!resultDiff.files) {
      return;
    }

    for (let file in resultDiff.files) {

      if (!resultDiff.files.hasOwnProperty(file)) {
        continue;
      }

      const langFileMeta = getTranslationLanguage(file);

      if (!!langFileMeta) {

        // 1. check that base file exists in file-structure

        if (!resultDiff.files[langFileMeta.base]) {
          // Type of Modified File
          resultDiff.files[langFileMeta.base] = 'M';
          // Adding default structure
          resultDiff.changes[langFileMeta.base] = _.cloneDeep(DIFF_STRUCTURE);
        }

        // 2. merge into base file diff

        mergeWithTranslations(
          langFileMeta.base,
          resultDiff.changes[langFileMeta.base].body,
          resultDiff.changes[file].body
        );

      }
    }
  }

  function getTranslationLanguage(fileName) {

    const regexpRule = /lang\/(.*)\/(.*)/;
    const regexpMatch = regexpRule.exec(fileName);

    return !!regexpMatch ? {
      lang: regexpMatch[1],
      base: regexpMatch[2]
    } : false;
  }

  function isDatapointFile(filename) {
    return filename.indexOf("--datapoints--") != -1 ? true : false;
  }

  function getFileNameResult(pathFolder, github) {

    const fileParts = /:(.*)\/(.*).git/.exec(github);

    const filePartsResult = [];
    filePartsResult.push('result');

    if(!fileParts) {
      filePartsResult.push('default');
    } else {
      filePartsResult.push(fileParts[1]);
      filePartsResult.push(fileParts[2]);
    }

    filePartsResult.push('output.json');
    return path.resolve(pathFolder, filePartsResult.join("--"));
  }

  function getUniqueKeyForRemove(filename, item, isDatapoint) {

    const keyArray = [];

    if(isDatapoint) {

      const fileParts = /ddf--datapoints--(.*)--by--(.*).csv/.exec(filename);
      const fileDimensions = fileParts[2].split("--");

      _.forEach(fileDimensions, function(itemDimension){
        keyArray.push(item[itemDimension]);
      });

    } else {

      const mainKey = _.head(_.keys(item));
      keyArray.push(item[mainKey]);
      keyArray.push(item[item[mainKey]]);
    }

    return _.join(keyArray, '*');
  }

  function getUniqueKeyForCreate(filename, item, isDatapoint) {

    if(isDatapoint) {
      return getUniqueKeyForRemove(filename, item, isDatapoint);
    }

    const keyArray = [];
    const mainKey = _.head(_.keys(item));
    keyArray.push(mainKey);
    keyArray.push(item[mainKey]);

    return _.join(keyArray, '*');
  }

  function getUniqueKeyForChange(filename, item, isDatapoint) {
    if(isDatapoint) {
      return getUniqueKeyForRemove(filename, item["data-origin"], isDatapoint);
    } else {
      return getUniqueKeyForRemove(filename, item, isDatapoint);
    }
  }

  function mergeWithTranslations(filename, diffTarget, diffBase) {

    const uniqueKeys = _getUniqueKeys(filename, diffTarget);

    _mergeStructureRemove(uniqueKeys, filename, diffTarget, diffBase);
    _mergeStructureCreate(uniqueKeys, filename, diffTarget, diffBase);
    _mergeStructureChange(uniqueKeys, filename, diffTarget, diffBase);
    _mergeStructureUpdate(uniqueKeys, filename, diffTarget, diffBase);
  }

  function _getUniqueKeys(filename, diffTarget) {

    const isDatapoint = isDatapointFile(filename);
    const uniqueKeys = new Set();

    _.forEach(diffTarget.remove, function (item) {
      const key = getUniqueKeyForRemove(filename, item, isDatapoint);
      uniqueKeys.add(key);
    });
    _.forEach(diffTarget.create, function (item) {
      const key = getUniqueKeyForCreate(filename, item, isDatapoint);
      uniqueKeys.add(key);
    });
    _.forEach(diffTarget.change, function (item) {
      const key = getUniqueKeyForChange(filename, item, isDatapoint);
      uniqueKeys.add(key);
    });
    _.forEach(diffTarget.update, function (item) {
      const key = getUniqueKeyForChange(filename, item, isDatapoint);
      uniqueKeys.add(key);
    });

    return uniqueKeys;
  }

  function _mergeStructureRemove(uniqueKeys, filename, diffTarget, diffBase) {

    if (diffBase.remove.length) {

      const isDatapoint = isDatapointFile(filename);

      // merge unique keys into base file
      _.forEach(diffBase.remove, function (item) {
        const key = getUniqueKeyForRemove(filename, item, isDatapoint);
        if(uniqueKeys.has(key)) {
          return;
        }

        // add to target
        diffTarget.translate.remove.push(item);
        uniqueKeys.add(key);
      });
    }
  }
  function _mergeStructureCreate(uniqueKeys, filename, diffTarget, diffBase) {

    if (diffBase.create.length) {

      const isDatapoint = isDatapointFile(filename);

      // merge unique keys into base file
      _.forEach(diffBase.create, function (item) {
        const key = getUniqueKeyForCreate(filename, item, isDatapoint);
        if(uniqueKeys.has(key)) {
          return;
        }

        // add to target
        diffTarget.translate.create.push(item);
        uniqueKeys.add(key);
      });

    }
  }
  function _mergeStructureChange(uniqueKeys, filename, diffTarget, diffBase) {

    if (diffBase.change.length) {

      const isDatapoint = isDatapointFile(filename);

      // merge unique keys into base file
      _.forEach(diffBase.change, function (item) {
        const key = getUniqueKeyForChange(filename, item, isDatapoint);
        if(uniqueKeys.has(key)) {
          return;
        }

        // add to target
        diffTarget.translate.change.push(item);
        uniqueKeys.add(key);
      });

    }
  }
  function _mergeStructureUpdate(uniqueKeys, filename, diffTarget, diffBase) {

    if (diffBase.update.length) {

      const isDatapoint = isDatapointFile(filename);

      // merge unique keys into base file
      _.forEach(diffBase.update, function (item) {
        const key = getUniqueKeyForChange(filename, item, isDatapoint);
        if(uniqueKeys.has(key)) {
          return;
        }

        // add to target
        diffTarget.translate.update.push(item);
        uniqueKeys.add(key);
      });

    }
  }

};

module.exports = new gitCsvDiff();
