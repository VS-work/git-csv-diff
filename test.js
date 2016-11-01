const gitCsvDiff = require('./index');

const options = {
  github: 'git@github.com:VS-work/ddf--ws-testing.git',
  hashFrom: 'dd40f5be01d9b7832336d38f91012082d78e6a84',
  hashTo: '8bdd93f133a6ce7a5c40a9b62df86434fe3eb77b',
  sourceFolder: './repos/',
  translations: true,
  resultToFile: true
};

gitCsvDiff.process(options, function(error, result) {
  //console.log("Files:", result.files);
  //console.log("Changes:", result.changes);
  console.log("Done");
});

// /^ddf--translation--(([\w]{2,}-[\w]{2,})|([\w]{2,}))--/.exec('ddf--translation--nlasd-nlaf--datapoints--company_size--by--company--anno.csv')