const expect = require("chai").expect;
const sinon = require("sinon");

const testFile = require("../../src/diff/header-update");

const diffModifiers = require('../../src/diff/modifiers');
const diffHelpers = require('../../src/diff/helpers');
const ModelDiff = require('../../src/model/diff');
const ModelResponse = require('../../src/model/response');

describe("Unit Test || diff/header-update.js", function () {

  describe("API::getType", function () {

    it("should return correct type", function (done) {

      const resultFixture = diffModifiers.COLUMN_UPDATE;
      const result = testFile.getType();
      expect(result).to.deep.equal(resultFixture);

      done();
    });

  });

  describe("API::process", function () {

    const baseStream = {};
    const metaData = {
      file: {old: {schema: {primaryKey: 'column 1'}}, new: {schema: {primaryKey: 'column 2'}}},
      fileName: 'ddf--concepts.csv'
    };
    const metaDataDatapoint = {
      file: {old: {schema: {primaryKey: 'column 1'}}, new: {schema: {primaryKey: 'column 2'}}},
      fileName: 'ddf--datapoints--lines.csv'
    };
    const modelDiff = ModelDiff.init();
    const diffResultColumns = ['column 1', 'column 2', 'column 3'];
    const rowValue = ['test 1', 'test 2', 'test 3'];

    modelDiff.header.create = ['column 1'];
    modelDiff.header.remove = ['column 3'];
    modelDiff.header.update = [{'column 2': 'column 4'}];

    it("should generate correct response model for non-datapoint file", function (done) {

      const diffHelpersStub = sinon.stub(diffHelpers, "writeToStream");

      const modelResponse = ModelResponse.init();
      modelResponse.metadata.file.new = metaData.file.new;
      modelResponse.metadata.file.old = metaData.file.old;

      const resultFixture = {
        "metadata": {
          "action": "change",
          "file": {
            "new": {
              "schema": {
                "primaryKey": "column 2"
              }
            },
            "old": {
              "schema": {
                "primaryKey": "column 1"
              }
            }
          },
          "lang": null,
          "onlyColumnsRemoved": false,
          "removedColumns": [],
          "type": null
        },
        "object": {
          "column 2": "test 2",
          "data-update": {
            "column 1": "test 1",
            "column 2": "test 2"
          },
          "data-origin": {
            "column 3": "test 3",
            "column 4": "test 2"
          },
          "gid": "column 2"
        }
      };

      testFile.process(baseStream, metaData, modelResponse, modelDiff, diffResultColumns, rowValue);
      expect(diffHelpersStub.calledOnce).to.equal(true);
      expect(diffHelpersStub.getCall(0).args[1]).to.deep.equal(resultFixture);

      diffHelpers.writeToStream.restore();
      done();
    });

    it("should generate correct response model for datapoint file", function (done) {

      const diffHelpersStub = sinon.stub(diffHelpers, "writeToStream");

      const modelResponse = ModelResponse.init();
      modelResponse.metadata.file.new = metaDataDatapoint.file.new;
      modelResponse.metadata.file.old = metaDataDatapoint.file.old;

      const resultFixture = {
        "metadata": {
          "action": "change",
          "file": {
            "new": {
              "schema": {
                "primaryKey": "column 2"
              }
            },
            "old": {
              "schema": {
                "primaryKey": "column 1"
              }
            }
          },
          "lang": null,
          "onlyColumnsRemoved": false,
          "removedColumns": [],
          "type": null
        },
        "object": {
          "column 2": "test 2",
          "data-origin": {
            "column 3": "test 3",
            "column 4": "test 2"
          },
          "data-update": {
            "column 1": "test 1",
            "column 2": "test 2"
          },
          "gid": "column 2"
        }
      };

      testFile.process(baseStream, metaDataDatapoint, modelResponse, modelDiff, diffResultColumns, rowValue);
      expect(diffHelpersStub.calledOnce).to.equal(true);
      expect(diffHelpersStub.getCall(0).args[1]).to.deep.equal(resultFixture);

      diffHelpers.writeToStream.restore();
      done();
    });

  });

});
