'use strict';

const util = require('util');
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

const fileName = "ddf--entities--company.csv";
const fileModifier = "M";
const resultDiff = {
  from: MockFrom,
  to: MockTo
};

gitCsvDiff.process(fileName, resultDiff, fileModifier, function(error, result){
  console.log("Done!");
  console.log(util.inspect(result, false, null));
});