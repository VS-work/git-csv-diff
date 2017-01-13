'use strict';

module.exports = {
  metaData: {
    fileName: 'ddf--entities--company--english_speaking.csv',
    fileModifier: 'M',
    datapackage: null
  },
  dataDiff: {
    from: 'english_speaking,is--english_speaking,name,additional_column\nmic,TRUE,Microsoft,any text 1\ngap,TRUE,Gapminder,any text 2\n',
    to: 'english_speaking,is--english_speaking,name,additional_column\nmcrsft,TRUE,Microsoft,any text 1\ngap,TRUE,Gapminder,any text 2\n'
  },
  streams: {
    diff: null,
    lang: null
  }
};