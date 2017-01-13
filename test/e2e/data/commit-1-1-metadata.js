'use strict';

module.exports = {
  metaData: {
    fileName: "ddf--concepts.csv",
    fileModifier: "M",
    datapackage: null
  },
  dataDiff: {
    from: 'concept,concept_type,domain\ncompany,entity_domain,\nenglish_speaking,entity_set,company\nfoundation,entity_set,company\ncompany_size,entity_set,company\nname,string,\nanno,time,\nlines_of_code,measure,\nregion,entity_domain,\ncountry,string,\nnum_users,measure,\nlatitude,measure,\nlongitude,measure,\nfull_name,string,\nproject,entity_domain,\ndomain,string,\n',
    to: 'concept,concept_type,domain,additional_column\ncompany,entity_domain,,\nenglish_speaking,entity_set,company,\nfoundation,entity_set,company,new value 1\ncompany_size,entity_set,company,\nname,string,,\nanno,time,,\nlines_of_code,measure,,\nregion,entity_domain,,\ncountry,string,,\nnum_users,measure,,new value 2\nlatitude,measure,,\nlongitude,measure,,\nfull_name_changed,string,,new value and change concept\nproject,entity_domain,,\ndomain,string,,\nadditional_column,string,,new row and column\n'
  },
  streams: {
    diff: null,
    lang: null
  }
};