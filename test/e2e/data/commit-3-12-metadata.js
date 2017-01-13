'use strict';

module.exports = {
  metaData: {
    fileName: 'lang/nl-nl/ddf--concepts.csv',
    fileModifier: 'M',
    datapackage: null
  },
  dataDiff: {
    from: 'concept,concept_type,domain,additional_column\ncompany,entity_domain,,bedrijf\nenglish_speaking,entity_set,company,Engels sprekende\nfoundation,entity_set,company,fundament\ncompany_size,entity_set,company,bedrijfsomvang\nname,string,,naam\nanno,time,,anno\nlines_of_code,measure,,lines_of_code\nregion,entity_domain,,regio\ncountry,string,,land\nnum_users,measure,,num gebruikers\nlatitude,measure,,breedtegraad\nlongitude,measure,,Lengtegraad\nfull_name_changed,string,,FULL_NAME veranderd\nproject,entity_domain,,project\ndomain,string,,domein\nadditional_column,string,,extra kolom\n',
    to: 'concept,concept_type,domain,additional_column\ncompany,entity_domain,,bedrijf\nenglish_speaking,entity_set,company,Engels sprekende\ncompany_scale,entity_set,company,company_scale\nname,string,,naam\nanno,time,,anno\nlines_of_code,measure,,lines_of_code\nregion,entity_domain,,regio\ncountry,string,,land\nlatitude,measure,,breedtegraad\nlongitude,measure,,Lengtegraad\nfull_name_changed,string,,FULL_NAME verandering\nproject,entity_domain,,project\ndomain,string,,domein\nadditional_column,string,,extra kolom\n'
  },
  streams: {
    diff: null,
    lang: null
  }
};