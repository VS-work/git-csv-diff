const fs = require('fs');
const path = require('path');
const async = require('async');
const byline = require('byline');
const expect = require("chai").expect;

const resultFileName = './test/e2e/result/stream-default.txt';
const resultFileLangName = './test/e2e/result/stream-translation.txt';

const filenameData = path.parse(__filename);
const iterationIndex = filenameData.name.split('-').pop();
const filesCount = 14;

const gitCsvDiff = require("../../index");

describe("Repo: ddf--ws-testing || chore(update): change entities and datapoints", function() {
  it("compare diff", function(done) {

    const dataPackage = require(`./data/commit-${iterationIndex}-datapackage`);
    const streamDefault = fs.createWriteStream(resultFileName);
    const streamTranslation = fs.createWriteStream(resultFileLangName);

    const iterationList = [];
    for(let i = 1; i <= filesCount; i++) {
      iterationList.push(`./data/commit-${iterationIndex}-${i}-metadata`);
    }

    async.mapSeries(
      iterationList,
      // iteration
      function(iterationFile, doneMapLimit) {

        const config = require(iterationFile);

        // setup iteration data
        config.metaData.datapackage = dataPackage;
        config.streams.diff = streamDefault;
        config.streams.lang = streamTranslation;

        gitCsvDiff.process(config.metaData, config.dataDiff, config.streams, function() {
          return doneMapLimit();
        });
      },
      // callback
      function () {

        let rowCounter;
        streamDefault.end();
        streamTranslation.end();

        rowCounter = 0;
        const diffFixtureDefault = fs.readFileSync(`./test/e2e/data/commit-${iterationIndex}-fixture-default.txt`, 'utf8');
        const diffFixtureDefaultRows = diffFixtureDefault.split("\n");

        const streamReadDefault = byline(fs.createReadStream(resultFileName, { encoding: 'utf8' }));

        streamReadDefault.on('data', function(line) {
          expect(line).to.eql(diffFixtureDefaultRows[rowCounter]);
          rowCounter++;
        });

        streamReadDefault.on('end', function() {

          rowCounter = 0;
          const diffFixtureTranslation = fs.readFileSync(`./test/e2e/data/commit-${iterationIndex}-fixture-translation.txt`, 'utf8');
          const diffFixtureTranslationRows = diffFixtureTranslation.split("\n");

          const streamReadTranslation = byline(fs.createReadStream(resultFileLangName, { encoding: 'utf8' }));

          streamReadTranslation.on('data', function(line) {
            // if(rowCounter == 2) { line += '!'; }
            expect(line).to.eql(diffFixtureTranslationRows[rowCounter]);
            rowCounter++;
          });

          streamReadTranslation.on('end', function() {
            done();
          });

        });
      }
    );
  });
});