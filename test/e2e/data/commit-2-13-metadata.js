'use strict';

module.exports = {
  metaData: {
    fileName: 'lang/nl-nl/ddf--entities--company.csv',
    fileModifier: 'M',
    datapackage: null
  },
  dataDiff: {
    from: 'company,name,country,region\nmic,Microsoft,Amerikas forente stater van Amerika,america\nvalor,Valor programvare,Ukraina,europe\n',
    to: 'company,name,country,region\nmcrsft,Microsoft,de Verenigde Staten van Amerika,america\nxsoft,XSoft,Turkije,asia\ngap,Gapminder,Zweden,europe\nvalor,Valor Software,Oekra?ne,europe\n'
  },
  streams: {
    diff: null,
    lang: null
  }
};