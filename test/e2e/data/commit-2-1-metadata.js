'use strict';

module.exports = {
  metaData: {
    fileName: 'ddf--datapoints--company_size--by--company--anno.csv',
    fileModifier: 'M',
    datapackage: null
  },
  dataDiff: {
    from: 'company,anno,company_size\nmic,1975,small\nmic,2015,large\nmic,2016,large\ngap,2015,small\ngap,2016,small\n',
    to: 'company,anno,company_size\nmcrsft,1975,small\nmcrsft,2015,large\nmcrsft,2016,large\ngap,2015,small\ngap,2016,small\n'
  },
  streams: {
    diff: null,
    lang: null
  }
};