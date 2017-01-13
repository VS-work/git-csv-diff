'use strict';

module.exports = {
  metaData: {
    fileName: 'lang/nl-nl/ddf--entities--company.csv',
    fileModifier: 'M',
    datapackage: null
  },
  dataDiff: {
    from: 'company,name,country,region\nmic,Microsoft,Verenigde Staten van Amerika,america\ngap,Gapminder,Zweden,europe\n',
    to: 'company,name,country,region\nmic,Microsoft,Amerikas forente stater van Amerika,america\nvalor,Valor programvare,Ukraina,europe\n'
  },
  streams: {
    diff: null,
    lang: null
  }
};