const expect = require("chai").expect;
const assert = require("chai").assert;

const testFile = require("../../src/diff/strategy");
const diffRowAdd = require("../../src/diff/row-add");

describe("Unit Test || diff/strategy.js", function () {

  describe("API::has", function () {

    it("should return correct result when strategy exists", function (done) {

      const inputValue = '+++';
      const resultFixture = true;

      const result = testFile.has(inputValue);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

    it("should return correct result when strategy does not exist", function (done) {

      const inputValue = '+++++';
      const resultFixture = false;

      const result = testFile.has(inputValue);
      expect(result).to.deep.equal(resultFixture);

      done();
    });

  });

  describe("API::get", function () {

    it("should return correct Instance for provided strategy", function (done) {

      const inputValue = '+++';
      const resultFixture = diffRowAdd.constructor;

      const result = testFile.get(inputValue);
      assert.instanceOf(result, resultFixture);

      done();
    });

    it("should return correct value for provided strategy", function (done) {

      const inputValue = '+++++';
      const resultFixture = false;

      const result = testFile.get(inputValue);
      expect(result).to.be.false;

      done();
    });

  });

});