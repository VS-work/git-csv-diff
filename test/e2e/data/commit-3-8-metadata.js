'use strict';

module.exports = {
  metaData: {
    fileName: 'ddf--entities--company--company_size.csv',
    fileModifier: 'D',
    datapackage: null
  },
  dataDiff: {
    from: 'company_size,full_name_changed,is--company_size\nsmall,Not very big,TRUE\nlarge,VERY BIG!!!$(#(*#*($,TRUE\nmedium,medium,TRUE\n',
    to: ''
  },
  streams: {
    diff: null,
    lang: null
  }
};