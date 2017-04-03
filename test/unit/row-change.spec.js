const expect = require("chai").expect;
const sinon = require("sinon");

const testFile = require("../../src/diff/row-change");

const diffModifiers = require('../../src/diff/modifiers');
const diffHelpers = require('../../src/diff/helpers');
const ModelDiff = require('../../src/model/diff');
const ModelResponse = require('../../src/model/response');

describe("Unit Test || diff/row-change.js", function () {

  describe("API::getType", function () {

    it("should return correct type", function (done) {

      const resultFixture = diffModifiers.CHANGE;
      const result = testFile.getType();
      expect(result).to.deep.equal(resultFixture);

      done();
    });

  });

  describe("API::process", function () {

    const baseStream = {};
    const metaData = {
      file: {old: {schema: {primaryKey: 'column 1'}}, new: {schema: {primaryKey: 'column 1'}}},
      fileName: 'ddf--concepts.csv'
    };
    const metaDataTranslation = {
      file: {old: {schema: {primaryKey: 'column 1'}}, new: {schema: {primaryKey: 'column 1'}}},
      fileName: '/lang/nl-nl/ddf--concepts.csv'
    };
    const metaDataDatapoint = {
      file: {old: {schema: {primaryKey: 'column 1'}}, new: {schema: {primaryKey: 'column 1'}}},
      fileName: 'ddf--datapoints--lines.csv'
    };
    const metaDataDatapointTranslation = {
      file: {old: {schema: {primaryKey: 'column 1'}}, new: {schema: {primaryKey: 'column 1'}}},
      fileName: '/lang/nl/nl/ddf--datapoints--lines.csv'
    };
    const metaDataTranslationGid = {
      file: {old: {schema: {primaryKey: 'column 1'}}, new: {schema: {primaryKey: 'column 2'}}},
      fileName: '/lang/nl-nl/ddf--concepts.csv'
    };
    const modelDiff = ModelDiff.init();
    const diffResultColumns = ['column 1', 'column 2', 'column 3', 'column 4'];
    const rowValue = ['test 1', 'test 2->test 5', 'test 3', 'test 4'];

    it("should generate correct response model for non-datapoint and non-translation file", function (done) {

      const diffHelpersStub = sinon.stub(diffHelpers, "writeToStream");

      const modelResponse = ModelResponse.init();
      modelResponse.metadata.file.new = metaData.file.new;
      modelResponse.metadata.file.old = metaData.file.old;
      modelDiff.header.create = [];
      modelDiff.header.remove = [];

      const resultFixture = {
        "metadata": {
          "action": "change",
          "file": {
            "new": {
              "schema": {
                "primaryKey": "column 1"
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
          "gid": "column 1",
          "column 1": "test 1",
          "data-origin": {
            "column 1": "test 1",
            "column 2": "test 2",
            "column 3": "test 3",
            "column 4": "test 4"
          },
          "data-update": {
            "column 1": "test 1",
            "column 2": "test 5",
            "column 3": "test 3",
            "column 4": "test 4"
          }
        }
      };

      testFile.process(baseStream, metaData, modelResponse, modelDiff, diffResultColumns, rowValue);
      expect(diffHelpersStub.calledOnce).to.equal(true);
      expect(diffHelpersStub.getCall(0).args[1]).to.deep.equal(resultFixture);

      diffHelpers.writeToStream.restore();
      done();
    });

    it("should generate correct response model for non-datapoint and non-translation file when new columns added/removed", function (done) {

      const diffHelpersStub = sinon.stub(diffHelpers, "writeToStream");

      const modelResponse = ModelResponse.init();
      modelResponse.metadata.file.new = metaData.file.new;
      modelResponse.metadata.file.old = metaData.file.old;
      modelDiff.header.create = ['column 3'];
      modelDiff.header.remove = ['column 4'];

      const resultFixture = {
        "metadata": {
          "action": "change",
          "file": {
            "new": {
              "schema": {
                "primaryKey": "column 1"
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
          "gid": "column 1",
          "column 1": "test 1",
          "data-origin": {
            "column 1": "test 1",
            "column 2": "test 2",
            "column 4": "test 4"
          },
          "data-update": {
            "column 1": "test 1",
            "column 2": "test 5",
            "column 3": "test 3"
          }
        }
      };

      testFile.process(baseStream, metaData, modelResponse, modelDiff, diffResultColumns, rowValue);
      expect(diffHelpersStub.calledOnce).to.equal(true);
      expect(diffHelpersStub.getCall(0).args[1]).to.deep.equal(resultFixture);

      diffHelpers.writeToStream.restore();
      done();
    });

    it("should generate correct response model for datapoint and non-translation file", function (done) {

      const diffHelpersStub = sinon.stub(diffHelpers, "writeToStream");

      const modelResponse = ModelResponse.init();
      modelResponse.metadata.file.new = metaDataDatapoint.file.new;
      modelResponse.metadata.file.old = metaDataDatapoint.file.old;
      modelDiff.header.create = [];
      modelDiff.header.remove = [];

      const resultFixture = {
        "metadata": {
          "action": "change",
          "file": {
            "new": {
              "schema": {
                "primaryKey": "column 1"
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
          "gid": "column 1",
          "column 1": "test 1",
          "data-update": {
            "column 1": "test 1",
            "column 2": "test 5",
            "column 3": "test 3",
            "column 4": "test 4"
          },
          "data-origin": {
            "column 1": "test 1",
            "column 2": "test 2",
            "column 3": "test 3",
            "column 4": "test 4"
          }
        }
      };

      testFile.process(baseStream, metaDataDatapoint, modelResponse, modelDiff, diffResultColumns, rowValue);
      expect(diffHelpersStub.calledOnce).to.equal(true);
      expect(diffHelpersStub.getCall(0).args[1]).to.deep.equal(resultFixture);

      diffHelpers.writeToStream.restore();
      done();
    });

    it("should generate correct response model for datapoint and non-translation file when new columns added/removed", function (done) {

      const diffHelpersStub = sinon.stub(diffHelpers, "writeToStream");

      const modelResponse = ModelResponse.init();
      modelResponse.metadata.file.new = metaDataDatapoint.file.new;
      modelResponse.metadata.file.old = metaDataDatapoint.file.old;
      modelDiff.header.create = ['column 3'];
      modelDiff.header.remove = ['column 4'];

      const resultFixture = {
        "metadata": {
          "action": "change",
          "file": {
            "new": {
              "schema": {
                "primaryKey": "column 1"
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
          "gid": "column 1",
          "column 1": "test 1",
          "data-update": {
            "column 1": "test 1",
            "column 2": "test 5",
            "column 3": "test 3"
          },
          "data-origin": {
            "column 1": "test 1",
            "column 2": "test 2",
            "column 4": "test 4"
          }
        }
      };

      testFile.process(baseStream, metaDataDatapoint, modelResponse, modelDiff, diffResultColumns, rowValue);
      expect(diffHelpersStub.calledOnce).to.equal(true);
      expect(diffHelpersStub.getCall(0).args[1]).to.deep.equal(resultFixture);

      diffHelpers.writeToStream.restore();
      done();
    });

    it("should generate correct response model for non-datapoint and translation file", function (done) {

      const diffHelpersStub = sinon.stub(diffHelpers, "writeToStream");

      const modelResponse = ModelResponse.init();
      modelResponse.metadata.file.new = metaDataTranslation.file.new;
      modelResponse.metadata.file.old = metaDataTranslation.file.old;
      modelDiff.header.create = [];
      modelDiff.header.remove = [];

      const resultFixture = {
        "metadata": {
          "action": "change",
          "file": {
            "new": {
              "schema": {
                "primaryKey": "column 1"
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
          "gid": "column 1",
          "column 1": "test 1",
          "data-origin": {
            "column 1": "test 1",
            "column 2": "test 2",
            "column 3": "test 3",
            "column 4": "test 4"
          },
          "data-update": {
            "column 1": "test 1",
            "column 2": "test 5",
            "column 3": "test 3",
            "column 4": "test 4"
          }
        }
      };

      testFile.process(baseStream, metaDataTranslation, modelResponse, modelDiff, diffResultColumns, rowValue);
      expect(diffHelpersStub.calledOnce).to.equal(true);
      expect(diffHelpersStub.getCall(0).args[1]).to.deep.equal(resultFixture);

      diffHelpers.writeToStream.restore();
      done();
    });

    it("should generate correct response model for datapoint and translation file when new columns added/removed", function (done) {

      const diffHelpersStub = sinon.stub(diffHelpers, "writeToStream");

      const modelResponse = ModelResponse.init();
      modelResponse.metadata.file.new = metaDataDatapointTranslation.file.new;
      modelResponse.metadata.file.old = metaDataDatapointTranslation.file.old;
      modelDiff.header.create = ['column 3'];
      modelDiff.header.remove = ['column 4'];

      const resultFixture = {
        "metadata": {
          "action": "change",
          "file": {
            "new": {
              "schema": {
                "primaryKey": "column 1"
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
          "gid": "column 1",
          "column 1": "test 1",
          "data-update": {
            "column 1": "test 1",
            "column 2": "test 5",
            "column 3": "test 3"
          },
          "data-origin": {
            "column 1": "test 1",
            "column 2": "test 2",
            "column 4": "test 4"
          }
        }
      };

      testFile.process(baseStream, metaDataDatapointTranslation, modelResponse, modelDiff, diffResultColumns, rowValue);
      expect(diffHelpersStub.calledOnce).to.equal(true);
      expect(diffHelpersStub.getCall(0).args[1]).to.deep.equal(resultFixture);

      diffHelpers.writeToStream.restore();
      done();
    });

    it("should generate correct response model for non-datapoint and translation file when GID changed", function (done) {

      const diffHelpersStub = sinon.stub(diffHelpers, "writeToStream");

      const modelResponse = ModelResponse.init();
      modelResponse.metadata.file.new = metaDataTranslationGid.file.new;
      modelResponse.metadata.file.old = metaDataTranslationGid.file.old;
      modelDiff.header.create = [];
      modelDiff.header.remove = [];

      const resultFixture = {
        "metadata": {
          "action": "remove",
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
          "gid": "column 2",
          "data-origin": {
            "column 1": "test 1",
            "column 2": "test 2",
            "column 3": "test 3",
            "column 4": "test 4"
          }
        }
      };
      const resultFixtureSecond = {
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
          "column 2": "test 5",
          "column 3": "test 3",
          "column 4": "test 4"
        }
      };

      testFile.process(baseStream, metaDataTranslation, modelResponse, modelDiff, diffResultColumns, rowValue);
      expect(diffHelpersStub.calledTwice).to.equal(true);
      expect(diffHelpersStub.getCall(0).args[1]).to.deep.equal(resultFixture);
      expect(diffHelpersStub.getCall(1).args[1]).to.deep.equal(resultFixtureSecond);

      diffHelpers.writeToStream.restore();
      done();
    });
  });

});
