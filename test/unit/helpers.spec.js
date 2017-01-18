const expect = require("chai").expect;
const sinon = require("sinon");

const testFile = require("../../src/diff/helpers");

describe("Unit Test || diff/helpers.js", function () {

  describe("API::getPrimaryKeys", function () {

    it("should return correct Primary Key when metadata contain new metadata", function (done) {

      const metadata = {file: {new: {schema: {primaryKey: ['pk1']}}}};
      const resultFixture = ['pk1'];

      const result = testFile.getPrimaryKeys(metadata);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

    it("should return correct Primary Key when metadata contain old metadata", function (done) {

      const metadata = {file: {old: {schema: {primaryKey: ['pk1']}}}};
      const resultFixture = ['pk1'];

      const result = testFile.getPrimaryKeys(metadata);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

    it("should return correct Primary Key when metadata contain old and new metadata", function (done) {

      const metadata = {file: {old: {schema: {primaryKey: ['pk1']}}, new: {schema: {primaryKey: ['pk2']}}}};
      const resultFixture = ['pk2'];

      const result = testFile.getPrimaryKeys(metadata);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

    it("should return correct Primary Key when metadata contain new metadata in string format", function (done) {

      const metadata = {file: {new: {schema: {primaryKey: 'pk1'}}}};
      const resultFixture = ['pk1'];

      const result = testFile.getPrimaryKeys(metadata);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

    it("should return correct Primary Key when metadata contain old metadata in string format", function (done) {

      const metadata = {file: {old: {schema: {primaryKey: 'pk1'}}}};
      const resultFixture = ['pk1'];

      const result = testFile.getPrimaryKeys(metadata);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

    it("should return correct Primary Key when metadata contain old and new metadata", function (done) {

      const metadata = {file: {old: {schema: {primaryKey: 'pk1'}}, new: {schema: {primaryKey: 'pk2'}}}};
      const resultFixture = ['pk2'];

      const result = testFile.getPrimaryKeys(metadata);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

  });

  describe("API::isDatapointFile", function () {

    it("should return correct result for datapoint file", function (done) {

      const input = 'ddf--datapoints--lines_of_code--by--company--project--anno.csv';
      const resultFixture = true;

      const result = testFile.isDatapointFile(input);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

    it("should return correct result for non-datapoint file", function (done) {

      const input = 'ddf--concepts.csv';
      const resultFixture = false;

      const result = testFile.isDatapointFile(input);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

  });

  describe("API::isLanguageFile", function () {

    it("should return correct result for translation file", function (done) {

      const input = '/lang/nl-nl/ddf--entities--company.csv';
      const resultFixture = true;

      const result = testFile.isLanguageFile(input);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

    it("should return correct result for non-translation file", function (done) {

      const input = '/test-folder/ddf--entities--company.csv';
      const resultFixture = false;

      const result = testFile.isLanguageFile(input);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

  });

  describe("API::writeToStream", function () {

    it("should write to stream appropriative string", function (done) {

      const model = {test: 'test 2'};
      const resultFixture = '{"test":"test 2"}\r\n';
      const streamStub = {write: sinon.spy()};

      testFile.writeToStream(streamStub, model);
      expect(streamStub.write.calledOnce).to.equal(true);
      expect(streamStub.write.getCall(0).args[0]).to.deep.equal(resultFixture);

      done();
    });

  });

  describe("API::isColumnRemoved", function () {

    it("should return correct result when column removed", function (done) {

      const modelDiff = {header: {remove: ['test 1', 'test 2']}};
      const columnValue = 'test 2';
      const resultFixture = true;

      const result = testFile.isColumnRemoved(modelDiff, columnValue);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

    it("should return correct result when column not removed", function (done) {

      const modelDiff = {header: {remove: ['test 1', 'test 2']}};
      const columnValue = 'test 3';
      const resultFixture = false;

      const result = testFile.isColumnRemoved(modelDiff, columnValue);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

  });

  describe("API::isColumnCreated", function () {

    it("should return correct result when column created", function (done) {

      const modelDiff = {header: {create: ['test 1', 'test 2']}};
      const columnValue = 'test 2';
      const resultFixture = true;

      const result = testFile.isColumnCreated(modelDiff, columnValue);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

    it("should return correct result when column not created", function (done) {

      const modelDiff = {header: {create: ['test 1', 'test 2']}};
      const columnValue = 'test 3';
      const resultFixture = false;

      const result = testFile.isColumnCreated(modelDiff, columnValue);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

  });

});