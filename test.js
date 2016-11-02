const gitCsvDiff = require('./index');

const commitList = [
  'acd712c4483f1fcd1072e119beb20f789cacf270',
  '4e3a3fe8ebee6772db302ef2a07298fcd778666e',
  '4265f17826a7bdeaa7e72eca1e4fe56faed70556',
  '193ae233af6d50ff4b78a01e88c306b763197308'
];

const options = {
  github: 'git@github.com:VS-work/ddf--ws-testing.git',
  hashFrom: commitList[2],
  hashTo: commitList[3],
  sourceFolder: './repos/',
  translations: true,
  resultToFile: true
};

gitCsvDiff.process(options, function(error, result) {
  //console.log("Files:", result.files);
  //console.log("Changes:", result.changes);
  console.log("Done");
});