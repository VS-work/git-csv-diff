'use strict';

module.exports = {
  metaData: {
    fileName: 'ddf--entities--region.csv',
    fileModifier: 'M',
    datapackage: null
  },
  dataDiff: {
    from: 'region,full_name\namerica,"The Americas, including north, south and central america"\neurope,The European part of Eurasia\n',
    to: 'region,full_name_changed\namerica,"The Americas, including north, south and central america"\neurope,The European part of Eurasia\n'
  },
  streams: {
    diff: null,
    lang: null
  }
};