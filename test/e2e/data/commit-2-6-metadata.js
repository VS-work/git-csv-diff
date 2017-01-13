'use strict';

module.exports = {
  metaData: {
    fileName: 'ddf--entities--company--company_size.csv',
    fileModifier: 'M',
    datapackage: null
  },
  dataDiff: {
    from: 'company_size,full_name_changed,is--company_size\nsmall,Not very big,TRUE\nlarge,VERY BIG!!!$(#(*#*($,TRUE\n',
    to: 'company_size,full_name_changed,is--company_size\nsmall,Not very big,TRUE\nlarge,VERY BIG!!!$(#(*#*($,TRUE\nmedium,medium,TRUE\n'
  },
  streams: {
    diff: null,
    lang: null
  }
};