'use strict';

module.exports = {
  metaData: {
    fileName: 'lang/nl-nl/ddf--entities--company--company_size.csv',
    fileModifier: 'M',
    datapackage: null
  },
  dataDiff: {
    from: 'company_size,full_name,is--company_size\nsmall,Niet heel groot,TRUE\nlarge,HEEL GROOT!!!$(#(*#*($,TRUE\n',
    to: 'company_size,full_name_changed,is--company_size\nsmall,Niet heel groot,TRUE\nlarge,HEEL GROOT!!!$(#(*#*($,TRUE\n'
  },
  streams: {
    diff: null,
    lang: null
  }
};