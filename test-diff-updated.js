'use strict';

const fs = require('fs');
const gitCsvDiff = require('./index');

let MockFrom = "";
MockFrom += "company,name,country" + "\r\n";
MockFrom += "mcrsft,Microsoft,United States of America" + "\r\n";
MockFrom += "gap,Gapminder,Sweden" + "\r\n";
MockFrom += "valor,Valor Sotware,Ukraine";

let MockTo = "";
MockTo += "company,country" + "\r\n";
MockTo += "mcrsft_updated,United States of America" + "\r\n";
MockTo += "valor_updated,Ukraine";

let MockDatapackageOld = {"name":"ddf--ws-testing","title":"ddf--ws-testing","description":"","version":"0.0.1","language":{"id":"en","name":"English"},"translations":[{"id":"nl-nl","name":"Dutch"}],"license":"","author":"","resources":[{"path":"ddf--concepts.csv","name":"ddf--concepts","schema":{"fields":[{"name":"concept"},{"name":"concept_type"},{"name":"domain"},{"name":"additional_column"}],"primaryKey":"concept"}},{"path":"ddf--entities--region.csv","name":"ddf--entities--region","schema":{"fields":[{"name":"region"},{"name":"full_name_changed"}],"primaryKey":"region"}}]};
let MockDatapackageNew = {"name":"ddf--ws-testing","title":"ddf--ws-testing","description":"","version":"0.0.1","language":{"id":"en","name":"English"},"translations":[{"id":"nl-nl","name":"Dutch"}],"license":"","author":"","resources":[{"path":"ddf--entities--region.csv","name":"ddf--entities--region","schema":{"fields":[{"name":"region"},{"name":"full_name_changed"}],"primaryKey":"region"}},{"path":"ddf--concepts.csv","name":"ddf--concepts","schema":{"fields":[{"name":"concept"},{"name":"concept_type"},{"name":"domain"},{"name":"additional_column"}],"primaryKey":"concept"}},{"path":"ddf--entities--region.csv","name":"ddf--entities--region","schema":{"fields":[{"name":"region"},{"name":"full_name_changed"}],"primaryKey":"region"}}]};

/* params */

const metaData = {
  fileName: "lang/nl-nl/ddf--entities--region.csv",
  //fileName: "ddf--entities--region.csv",
  fileModifier: "M",
  datapackage: {
    old: MockDatapackageOld,
    new: MockDatapackageNew
  }
};
const dataDiff = {
  from: MockFrom,
  to: MockTo
};
const streams = {
  diff: fs.createWriteStream('result-diff.txt'),
  lang: fs.createWriteStream('result-diff-lang.txt')
};

/* usage */

gitCsvDiff.processUpdated(metaData, dataDiff, streams, function(){
  console.log("Done!");

  streams.diff.end();
  streams.lang.end();
});