const expect = require("chai").expect;

const ModelDiff = require('../../src/model/diff');

const testFile = require("../../src/diff/columns");

describe("Unit Test || diff/columns.js", function () {

  describe("API::process", function () {

    it("should return correct result for input Data without structure changes modifier", function (done) {

      const modelDiff = ModelDiff.init();
      const diffResult = [['@@', 'column 1', 'column 2']];
      const resultFixture = ['column 1', 'column 2'];

      const result = testFile.process(diffResult, modelDiff);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

    it("should return correct result for input Data with structure changes modifier", function (done) {

      const modelDiff = ModelDiff.init();
      const diffResult = [['!', '---', '+++', ':', '', '(old_column)'], ['@@', 'column 1', 'column 2', 'column 3', 'column 4', 'column 5']];
      const resultFixture = ['column 1', 'column 2', 'column 3', 'column 4', 'column 5'];

      const result = testFile.process(diffResult, modelDiff);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

    it("should return increased result model for 'create' section for input Data", function (done) {

      const modelDiff = ModelDiff.init();
      const diffResult = [['!', '+++'], ['@@', 'column 1']];

      expect(modelDiff.header.create.length).to.equal(0);
      expect(modelDiff.header.update.length).to.equal(0);
      expect(modelDiff.header.remove.length).to.equal(0);
      const result = testFile.process(diffResult, modelDiff);
      expect(modelDiff.header.create.length).to.equal(1);
      expect(modelDiff.header.update.length).to.equal(0);
      expect(modelDiff.header.remove.length).to.equal(0);

      done();
    });

    it("should return increased result model for 'remove' section for input Data", function (done) {

      const modelDiff = ModelDiff.init();
      const diffResult = [['!', '---'], ['@@', 'column 1']];

      expect(modelDiff.header.create.length).to.equal(0);
      expect(modelDiff.header.remove.length).to.equal(0);
      expect(modelDiff.header.update.length).to.equal(0);
      const result = testFile.process(diffResult, modelDiff);
      expect(modelDiff.header.remove.length).to.equal(1);
      expect(modelDiff.header.update.length).to.equal(0);
      expect(modelDiff.header.create.length).to.equal(0);

      done();
    });

    it("should return increased result model for 'update' section for input Data", function (done) {

      const modelDiff = ModelDiff.init();
      const diffResult = [['!', '(column)'], ['@@', 'column']];

      expect(modelDiff.header.update.length).to.equal(0);
      expect(modelDiff.header.create.length).to.equal(0);
      expect(modelDiff.header.remove.length).to.equal(0);
      const result = testFile.process(diffResult, modelDiff);
      expect(modelDiff.header.update.length).to.equal(1);
      expect(modelDiff.header.remove.length).to.equal(1);
      expect(modelDiff.header.create.length).to.equal(0);

      done();
    });

    it("should return equal result model with 'reorder' modifier for input Data", function (done) {

      const modelDiff = ModelDiff.init();
      const diffResult = [['!', ':'], ['@@', 'column 1']];

      expect(modelDiff.header.remove.length).to.equal(0);
      expect(modelDiff.header.create.length).to.equal(0);
      expect(modelDiff.header.update.length).to.equal(0);
      const result = testFile.process(diffResult, modelDiff);
      expect(modelDiff.header.remove.length).to.equal(0);
      expect(modelDiff.header.create.length).to.equal(0);
      expect(modelDiff.header.update.length).to.equal(0);

      done();
    });

  });
});