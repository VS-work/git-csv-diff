'use strict';

module.exports = {
  metaData: {
    fileName: 'ddf--concepts.csv',
    fileModifier: 'M',
    datapackage: null
  },
  dataDiff: {
    from: 'concept,concept_type,domain,additional_column\ncompany,entity_domain,,\nenglish_speaking,entity_set,company,\ncompany_scale,entity_set,company,updated\nname,string,,\nanno,time,,\nlines_of_code,measure,,\nregion,entity_domain,,\ncountry,string,,\nlatitude,measure,,\nlongitude,measure,,\nfull_name_changed,string,,new value and change concept\nproject,entity_domain,,\ndomain,string,,\nadditional_column,string,,new row and column\n',
    to: 'concept,concept_type,domain,additional_column\ncompany,entity_domain,,\nenglish_speaking,entity_set,company,\ncompany_scale,entity_set,company,updated\nname,string,,\nanno,time,,\nlines_of_code,measure,,\nregion,entity_domain,,\ncountry,string,,\nlatitude,measure,,\nlongitude,measure,,\nfull_name_changed,string,,new value and change concept\nproject,entity_domain,,\ndomain,string,,\nadditional_column,string,,new row and column\nmeeting_type,string,,\npopularity,string,,\nmethodology,string,,\n'
  },
  streams: {
    diff: null,
    lang: null
  }
};