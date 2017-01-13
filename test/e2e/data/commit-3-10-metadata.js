'use strict';

module.exports = {
  metaData: {
    fileName: 'ddf--entities--company.csv',
    fileModifier: 'M',
    datapackage: null
  },
  dataDiff: {
    from: 'company,name,country,region\nmcrsft,Microsoft,United States of America,america\ngap,Gapminder,Sweden,europe\nvalor,Valor Sotware,Ukraine,europe\nxsoft,XSoft,Turkey,asia\n',
    to: 'company,name,country,region\nmcrsft,Microsoft,United States of America,america\ngap,Gapminder,Sweden,europe\nvalor,Valor Sotware,Ukraine,europe\nzsoft,Z-Soft,Turkey,asia\n'
  },
  streams: {
    diff: null,
    lang: null
  }
};