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

/* params */

const metaData = {
  fileName: "ddf--entities--company.csv",
  fileModifier: "M"
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