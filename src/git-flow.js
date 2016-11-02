'use strict';

const fs = require('fs');
const path = require('path');
const async = require("async");

const simpleGit = require('simple-git')();
simpleGit.silent(true);

function gitFlow () {};

gitFlow.prototype.getShortHash = function (commit) {
  return !!commit ? commit.substring(0, 7) : '';
};

gitFlow.prototype.setSourceFolder = function (path) {
  this.path = path;
};

gitFlow.prototype.configDir = function (github) {
  let gitFolder = this.getRepoFolder(github);
  simpleGit._baseDir = gitFolder;
  return gitFolder + "/";
};

gitFlow.prototype.getRepoName = function (github) {
  let regexpFolder = /:(.+)\/(.+)\.git/;
  let regexpFolderRes = regexpFolder.exec(github);
  let regexpFolderGitFolder = regexpFolderRes[2] || false;
  let regexpFolderRootGitFolder = regexpFolderRes[1] || false;
  let repoName = regexpFolderRootGitFolder + '/' + regexpFolderGitFolder;
  return repoName.length > 1 ? repoName : '';
};

gitFlow.prototype.getRepoFolder = function (github) {
  let regexpFolderGitFolder = this.getRepoName(github);
  let targetFolder = this.path + regexpFolderGitFolder;
  if(!fs.existsSync(targetFolder)) {
    let targetFolderRoot = path.dirname(targetFolder);
    if(!fs.existsSync(targetFolderRoot)) {
      fs.mkdirSync(targetFolderRoot);
    }
    fs.mkdirSync(targetFolder);
  }
  return targetFolder;
};

gitFlow.prototype.registerRepo = function (github, callback) {

  let gitFolder = this.configDir(github);

  simpleGit.clone(github, gitFolder, function(error, result){

    simpleGit.fetch('origin', 'master', function(error, result){

      if(error) {
        return callback(error);
      }

      simpleGit.reset(['--hard', 'origin/master'], function(error, result){

        if(error) {
          return callback(error);
        }

        return callback();
      });

    });
  });
};

gitFlow.prototype.getFileDiffByHashes = function (data, gitDiffFileStatus, callback) {

  let github = data.github;
  let hashFrom = data.hashFrom;
  let hashTo = data.hashTo;

  this.registerRepo(github, function(){

    simpleGit.diff([hashFrom + '..' + hashTo, "--name-only"], function(error, result) {

      if(error) {
        return callback(error);
      }

      let resultGitDiff = result;
      let gitDiffFileList = resultGitDiff.split("\n").filter(function(value){
        return !!value && value.indexOf(".csv") != -1;
      });

      // fix path with folders
      gitDiffFileList.forEach(function(item, index, arr){
        //arr[index] = path.parse(item).base;
        arr[index] = item;
      });

      simpleGit.diff([hashFrom + '..' + hashTo, "--name-status"], function(error, result) {

        result.split("\n").filter(function(value) {
          return !!value && value.indexOf(".csv") != -1;
        }).map(function(rawFile) {
          let fileStat = rawFile.split("\t");
          gitDiffFileStatus[fileStat[1]] = fileStat[0];
        });

        callback(null, gitDiffFileList);
      });
    });

  });
};

gitFlow.prototype.showFileStateByHash = function (data, fileName, callback) {

  let gitHashFrom = data.hashFrom + ':' + fileName;
  let gitHashTo = data.hashTo + ':' + fileName;

  async.waterfall(
    [
      function(done) {

        simpleGit.show([gitHashFrom], function(error, result){
          result = !!error ? '' : result;
          return done(null, result);
        });

      },
      function(dataFrom, done) {

        simpleGit.show([gitHashTo], function(error, result){
          result = !!error ? '' : result;
          return done(null, {from: dataFrom, to: result});
        });

      }
    ],
    // callback
    function(error, result) {
      callback(error, result);
    }
  );
};

module.exports = new gitFlow();