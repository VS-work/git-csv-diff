'use strict';

const _ = require('lodash');
const ModelDiff = require('./model-diff');

function diffTranslations() {
  return {
    process: _process
  };
};
/* public api */
function _process(resultDiff){
  return generateTranslations(resultDiff);
}
/* protected */
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
        resultDiff.changes[langFileMeta.base] = ModelDiff.init();
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
function getUniqueKeyForRemove(filename, item, isDatapoint) {

  const keyArray = [];

  if (isDatapoint) {

    const fileParts = /ddf--datapoints--(.*)--by--(.*).csv/.exec(filename);
    const fileDimensions = fileParts[2].split("--");

    _.forEach(fileDimensions, function (itemDimension) {
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

  if (isDatapoint) {
    return getUniqueKeyForRemove(filename, item, isDatapoint);
  }

  const keyArray = [];
  const mainKey = _.head(_.keys(item));
  keyArray.push(mainKey);
  keyArray.push(item[mainKey]);

  return _.join(keyArray, '*');
}
function getUniqueKeyForChange(filename, item, isDatapoint) {
  if (isDatapoint) {
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
      if (uniqueKeys.has(key)) {
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
      if (uniqueKeys.has(key)) {
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
      if (uniqueKeys.has(key)) {
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
      if (uniqueKeys.has(key)) {
        return;
      }

      // add to target
      diffTarget.translate.update.push(item);
      uniqueKeys.add(key);
    });

  }
}


module.exports = new diffTranslations();