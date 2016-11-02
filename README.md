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

const options = {
  github: 'git@github.com:VS-work/ddf-gapminder-world-stub-4-validated.git',
  hashFrom: '63fdcedcd44099f8296ad72d925d2805c6d7cf8e',
  hashTo: '177cbf088612423289c7666b9fb29e6607eb54eb',
  sourceFolder: './repos/',
  // optional
  translations: true,
  resultToFile: true
};

gitCsvDiff.process(options, function(error, result) {
  //console.log("Files:", result.files);
  //console.log("Changes:", result.changes);
  console.log("Done");
});

```
