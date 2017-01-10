'use strict';

const _ = require('lodash');
const daff = require('daff');
const path = require('path');
const async = require("async");

/* Models */

const ModelDiff = require('./model/diff');
const ModelResponse = require('./model/response');

/* Diff generators */

const diffModifiers = require('./diff/modifiers');
const diffColumns = require('./diff/columns');
const diffStrategy = require('./diff/strategy');
const diffHelpers = require('./diff/helpers');

function diffByFile() {
  return {
    process: _process
  };
}

// metaData.fileName;
// metaData.fileModifier;

// dataDiff.from;
// dataDiff.to;

// streams.diff;
// streams.lang;

function _process(metaData, dataDiff, streams) {

  const isTranslations = diffHelpers.isLanguageFile(metaData.fileName);
  const baseStream = isTranslations ? streams.lang : streams.diff;

  /* Prepare Data Structure */

  let modelDiff = ModelDiff.init();
  let modelResponse = ModelResponse.init();

  setMetaDataFile(modelResponse.metadata.file, metaData);

  // validate input data
  if(!isSchemaExists(modelResponse.metadata) || !isValidFilePath(metaData.fileName)) {
    return;
  }

  // setup response meta data

  setMetaDataType(modelResponse.metadata);
  setMetaDataLanguage(modelResponse.metadata, metaData.fileName);

  /* Process Diff by Daff */

  const diffResult = initDaffDiff(dataDiff);


  /* Main flow */


  /* Head, File Columns */
  // [ 'city', 'name', 'country' ]
  const diffResultColumns = diffColumns.process(diffResult, modelDiff);

  // setup `removedColumns` for files that are not removed
  if (metaData.fileModifier != "D") {
    modelResponse.metadata.removedColumns = _.clone(modelDiff.header.remove);
  }

  // process each row if any changes detected

  if (diffResult.length) {
    diffResult.forEach(function (rowValue) {

      const modificationType = rowValue.shift();

      // check that something was changed
      if (modificationType !== diffModifiers.BLANK) {
        if(diffStrategy.has(modificationType)){
          const diffInstance = diffStrategy.get(modificationType);
          diffInstance.process(modelResponse, modelDiff, diffResultColumns, rowValue);
          writeToStream(baseStream, modelResponse);
        }
      // if nothing changed
      } else {
        // Case: new columns were added
        if (modelDiff.header.create.length) {
          const diffInstance = diffStrategy.get(diffModifiers.COLUMN_CREATE);
          diffInstance.process(modelResponse, modelDiff, diffResultColumns, rowValue);
          writeToStream(baseStream, modelResponse);
        }
        // Case: columns were renamed
        if (modelDiff.header.update.length) {
          const diffInstance = diffStrategy.get(diffModifiers.COLUMN_UPDATE);
          diffInstance.process(modelResponse, modelDiff, diffResultColumns, rowValue);
          writeToStream(baseStream, modelResponse);
        }
        // Case: columns were removed
        if (modelDiff.header.remove.length) {
          const diffInstance = diffStrategy.get(diffModifiers.COLUMN_REMOVE);
          diffInstance.process(modelResponse, modelDiff, diffResultColumns, rowValue);
          writeToStream(baseStream, modelResponse);
        }
      }
    });
  }

  return;
}

function isValidFilePath(filename) {
  return (_.includes(filename, "/") && !diffHelpers.isLanguageFile(filename)) ? false : true;
}
function setMetaDataLanguage(metaData, fileName) {
  let lang = 'default';
  if(diffHelpers.isLanguageFile(fileName)) {
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
  const constants = {
    DATAPOINTS: 'datapoints',
    CONCEPTS: 'concepts',
    ENTITIES: 'entities'
  };
  const primaryKeys = diffHelpers.getPrimaryKeys(metadata);

  if (primaryKeys.length > 1)
    return metadata.type = constants.DATAPOINTS;

  if (_.includes(constants.CONCEPTS, _.first(primaryKeys)))
    return metadata.type = constants.CONCEPTS;

  return metadata.type = constants.ENTITIES;
}
function writeToStream(stream, model) {
  let modelString = JSON.stringify(model);
  stream.write(modelString + "\r\n");
}
function initDaffDiff(dataDiff) {
  const diffResult = [];

  const tableFrom = new daff.Csv().makeTable(dataDiff.from);
  const tableTo = new daff.Csv().makeTable(dataDiff.to);

  const filesDiff = daff.compareTables(tableFrom, tableTo).align();

  const flags = new daff.CompareFlags();
  flags.show_unchanged = true;
  flags.show_unchanged_columns = true;
  flags.always_show_header = true;

  const highlighter = new daff.TableDiff(filesDiff, flags);
  highlighter.hilite(diffResult);

  return diffResult;
}

module.exports = new diffByFile();