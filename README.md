# Git CSV Diff

Library generate difference between csv-files based on Git commit hash

## Installation

Make sure you have node.js (version 4.x.x or higher) installed on your computer.

```bash
    npm i git-csv-diff
```

## Usage

```bash

const gitCsvDiff = require('git-csv-diff');

/*
    fileName: 'ddf--datapoints--forest_products_removal_total_dollar--by--geo--time.csv';
    diff: {
        from: 'state of the base file'
        to: 'state of the target file'
    };
    fileModifier: 'M'/'D'/'A'
*/

let diffResult = {};

gitCsvDiff.process(fileName, diff, fileModifier, function(error, result) {
  //console.log("Files:", result.file);
  //console.log("Changes:", result.diff);
  diffResult[result.file] = result.diff;

  gitCsvDiff.translations(diffResult);
});

```
