const expect = require("chai").expect;
const sinon = require("sinon");

const testFile = require("../../src/diff/row-add");

const diffModifiers = require('../../src/diff/modifiers');
const diffHelpers = require('../../src/diff/helpers');
const ModelDiff = require('../../src/model/diff');
const ModelResponse = require('../../src/model/response');

describe("Unit Test || diff/row-add.js", function () {

  describe("API::getType", function () {

    it("should return correct type", function (done) {

      const resultFixture = diffModifiers.ADD;
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

    it("should generate correct response model when some column removed", function (done) {

      const diffHelpersStub = sinon.stub(diffHelpers, "writeToStream");

      const modelResponse = ModelResponse.init();
      modelResponse.metadata.file.new = metaData.file.new;
      modelResponse.metadata.file.old = metaData.file.old;
      modelDiff.header.remove = ['column 3'];

      const resultFixture = {
        "metadata": {
          "action": "create",
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
          "column 1": "test 1",
          "column 2": "test 2"
        }
      };

      testFile.process(baseStream, metaData, modelResponse, modelDiff, diffResultColumns, rowValue);
      expect(diffHelpersStub.calledOnce).to.equal(true);
      expect(diffHelpersStub.getCall(0).args[1]).to.deep.equal(resultFixture);

      diffHelpers.writeToStream.restore();
      done();
    });

    it("should generate correct response model when no removed columns", function (done) {

      const diffHelpersStub = sinon.stub(diffHelpers, "writeToStream");

      const modelResponse = ModelResponse.init();
      modelResponse.metadata.file.new = metaData.file.new;
      modelResponse.metadata.file.old = metaData.file.old;
      modelDiff.header.remove = [];

      const resultFixture = {
        "metadata": {
          "action": "create",
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
          "column 1": "test 1",
          "column 2": "test 2",
          "column 3": "test 3"
        }
      };

      testFile.process(baseStream, metaDataDatapoint, modelResponse, modelDiff, diffResultColumns, rowValue);
      expect(diffHelpersStub.calledOnce).to.equal(true);
      expect(diffHelpersStub.getCall(0).args[1]).to.deep.equal(resultFixture);

      diffHelpers.writeToStream.restore();
      done();
    });

    it("should generate correct response model when all columns removed", function (done) {

      const diffHelpersStub = sinon.stub(diffHelpers, "writeToStream");

      const modelResponse = ModelResponse.init();
      modelResponse.metadata.file.new = metaData.file.new;
      modelResponse.metadata.file.old = metaData.file.old;
      modelDiff.header.remove = ["column 1", "column 2", "column 3"];

      const resultFixture = {
        "metadata": {
          "action": null,
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
        "object": null
      };

      testFile.process(baseStream, metaDataDatapoint, modelResponse, modelDiff, diffResultColumns, rowValue);
      expect(diffHelpersStub.called).to.be.false;

      diffHelpers.writeToStream.restore();
      done();
    });

  });

});