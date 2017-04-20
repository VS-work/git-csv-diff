'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const diffByFile = require('../../src/diff-by-file');

describe('Diff by file', () => {
  it('segregates primary keys in resources to old and new (old and new datapackage) and maps them to file path', function () {
    const metadata = {
      datapackage: {
        old: {
          resources: [{
            path: 'foo.csv',
            schema: {
              primaryKey: ['foo_key']
            }
          }]
        },
        new: {
          resources: [
            {
              path: 'bar.csv',
              schema: {
                primaryKey: ['bar_key', 'bar_key2']
              }
            },
            {
              path: 'baz.csv',
              schema: {
                primaryKey: 'baz_key'
              }
            }
          ]
        }
      }
    };

    const splitPrimaryKeysByPathToOldAndNew = diffByFile._splitPrimaryKeysByPathToOldAndNew(metadata);
    expect(splitPrimaryKeysByPathToOldAndNew).to.deep.equal({
      primaryKeyByPath: {
        old: {
          'foo.csv': ['foo_key']
        },
        new: {
          'bar.csv': ['bar_key', 'bar_key2'],
          'baz.csv': 'baz_key'
        }
      }
    });
  });
});
