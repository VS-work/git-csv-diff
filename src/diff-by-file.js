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

// metadata.fileName;
// metadata.fileModifier;

// dataDiff.from;
// dataDiff.to;

// streams.diff;
// streams.lang;

module.exports = {
  process: _process,
  _splitPrimaryKeysByPathToOldAndNew: splitPrimaryKeysByPathToOldAndNew
};

function _process(metadata, dataDiff, streams) {

  metadata = Object.assign({}, metadata, splitPrimaryKeysByPathToOldAndNew(metadata));
  console.log('Processing file: ', metadata.fileName);

  const isTranslations = diffHelpers.isLanguageFile(metadata.fileName);
  const baseStream = isTranslations ? streams.lang : streams.diff;

  /* Prepare Data Structure */

  let modelDiff = ModelDiff.init();
  let modelResponse = ModelResponse.init();

  // setup response meta data - DON'T CHANGE THE ORDER
  setMetaDataLanguage(modelResponse.metadata, metadata);
  setMetaDataFile(modelResponse.metadata, metadata);
  setMetaDataType(modelResponse.metadata, metadata);

  // validate input data

  if (!isSchemaExists(modelResponse.metadata)) {
    console.error('Given schema doesn\'t exist!', JSON.stringify(modelResponse.metadata, null, '\t'));
    throw new Error(`Given schema doesn\'t exist!\n${JSON.stringify(modelResponse.metadata, null, '\t')}`);
  }

  /* Process Diff by Daff */

  const diffResult = initDaffDiff(dataDiff);
  console.log(diffResult);

  /* Main flow */


  /* Head, File Columns */
  // [ 'city', 'name', 'country' ]
  const diffResultColumns = diffColumns.process(diffResult, modelDiff);

  // setup `removedColumns` for files that are not removed
  if (metadata.fileModifier != "D") {
    modelResponse.metadata.removedColumns = _.clone(modelDiff.header.remove);
  }

  // process each row if any changes detected

  if (diffResult.length) {
    diffResult.forEach(function (rowValue) {

      const modificationType = rowValue.shift();

      // check that something was changed
      if (modificationType !== diffModifiers.BLANK) {
        if (diffStrategy.has(modificationType)) {
          const diffInstance = diffStrategy.get(modificationType);
          diffInstance.process(baseStream, metadata, modelResponse, modelDiff, diffResultColumns, rowValue);
        }
        // if nothing changed
      } else {
        // Case: new columns were added
        if (modelDiff.header.create.length) {
          const diffInstance = diffStrategy.get(diffModifiers.COLUMN_CREATE);
          diffInstance.process(baseStream, metadata, modelResponse, modelDiff, diffResultColumns, rowValue);
        }
        // Case: columns were renamed
        if (modelDiff.header.update.length) {
          const diffInstance = diffStrategy.get(diffModifiers.COLUMN_UPDATE);
          diffInstance.process(baseStream, metadata, modelResponse, modelDiff, diffResultColumns, rowValue);
        }
        // Case: columns were removed
        if (modelDiff.header.remove.length) {
          const diffInstance = diffStrategy.get(diffModifiers.COLUMN_REMOVE);
          diffInstance.process(baseStream, metadata, modelResponse, modelDiff, diffResultColumns, rowValue);
        }
      }
    });
  }

  return;
}

function setMetaDataLanguage(metadataModel, metadata) {
  let lang = 'default';
  const fileName = metadata.fileName;
  if (diffHelpers.isLanguageFile(fileName)) {
    const regexpRes = /lang\/(.+)\//.exec(fileName);
    lang = regexpRes[1] || lang;
  }

  _.extend(metadataModel, {lang});
}

function setMetaDataFile(metadataModel, metadata) {
  const fileName = diffHelpers.getOriginalFileName(metadata.fileName, metadataModel.lang);
  const resourcesByPathOld = _.keyBy(metadata.datapackage.old.resources, 'path');
  metadataModel.file.old = resourcesByPathOld[fileName];

  // info is not available if file was removed
  if (metadata.fileModifier != "D") {
    const resourcesByPathNew = _.keyBy(metadata.datapackage.new.resources, 'path');
    metadataModel.file.new = resourcesByPathNew[fileName];
  }
}

function isSchemaExists(metadata) {
  const schemaSource = metadata.file.new ? metadata.file.new : metadata.file.old;
  return schemaSource && schemaSource.hasOwnProperty('schema');
}

function setMetaDataType(metadataModel, metadata) {
  const constants = {
    DATAPOINTS: 'datapoints',
    CONCEPTS: 'concepts',
    ENTITIES: 'entities'
  };
  const primaryKeys = diffHelpers.getPrimaryKeys(metadataModel);

  if (primaryKeys.length > 1)
    return metadataModel.type = constants.DATAPOINTS;

  if (_.includes(constants.CONCEPTS, _.first(primaryKeys)))
    return metadataModel.type = constants.CONCEPTS;

  return metadataModel.type = constants.ENTITIES;
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

function splitPrimaryKeysByPathToOldAndNew(metadata) {
  return {
    primaryKeyByPath: {
      old: convertResourcesToPrimaryKeyByPath(_.get(metadata, 'datapackage.old.resources')),
      new: convertResourcesToPrimaryKeyByPath(_.get(metadata, 'datapackage.new.resources'))
    }
  };
}

function convertResourcesToPrimaryKeyByPath(resources) {
  return _.reduce(resources, (result, resource) => {
    result[resource.path] = resource.schema.primaryKey;
    return result;
  }, {});
}
