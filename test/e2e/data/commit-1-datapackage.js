'use strict';

module.exports = {
  "old": {
    "name": ".",
    "title": ".",
    "description": "",
    "version": "0.0.1",
    "language": {
      "id": "en",
      "name": "English"
    },
    "translations": [
      {
        "id": "nl-nl",
        "name": "nl-nl"
      }
    ],
    "license": "",
    "author": "",
    "resources": [
      {
        "path": "ddf--concepts.csv",
        "name": "ddf--concepts",
        "schema": {
          "fields": [
            {
              "name": "concept"
            },
            {
              "name": "concept_type"
            },
            {
              "name": "domain"
            }
          ],
          "primaryKey": "concept"
        }
      },
      {
        "path": "ddf--datapoints--company_size--by--company--anno.csv",
        "name": "ddf--datapoints--company_size--by--company--anno",
        "schema": {
          "fields": [
            {
              "name": "company"
            },
            {
              "name": "anno"
            },
            {
              "name": "company_size"
            }
          ],
          "primaryKey": [
            "company",
            "anno"
          ]
        }
      },
      {
        "path": "ddf--datapoints--lines_of_code--by--company--anno.csv",
        "name": "ddf--datapoints--lines_of_code--by--company--anno",
        "schema": {
          "fields": [
            {
              "name": "company"
            },
            {
              "name": "anno"
            },
            {
              "name": "lines_of_code"
            }
          ],
          "primaryKey": [
            "company",
            "anno"
          ]
        }
      },
      {
        "path": "ddf--datapoints--lines_of_code--by--company--project--anno.csv",
        "name": "ddf--datapoints--lines_of_code--by--company--project--anno",
        "schema": {
          "fields": [
            {
              "name": "company"
            },
            {
              "name": "project"
            },
            {
              "name": "anno"
            },
            {
              "name": "lines_of_code"
            }
          ],
          "primaryKey": [
            "company",
            "project",
            "anno"
          ]
        }
      },
      {
        "path": "ddf--datapoints--lines_of_code--by--company--project.csv",
        "name": "ddf--datapoints--lines_of_code--by--company--project",
        "schema": {
          "fields": [
            {
              "name": "company"
            },
            {
              "name": "project"
            },
            {
              "name": "lines_of_code"
            }
          ],
          "primaryKey": [
            "company",
            "project"
          ]
        }
      },
      {
        "path": "ddf--datapoints--num_users--by--company--project.csv",
        "name": "ddf--datapoints--num_users--by--company--project",
        "schema": {
          "fields": [
            {
              "name": "company"
            },
            {
              "name": "project"
            },
            {
              "name": "longitude"
            },
            {
              "name": "latitude"
            },
            {
              "name": "num_users"
            }
          ],
          "primaryKey": [
            "company",
            "project"
          ]
        }
      },
      {
        "path": "ddf--entities--company--company_size.csv",
        "name": "ddf--entities--company--company_size",
        "schema": {
          "fields": [
            {
              "name": "company_size"
            },
            {
              "name": "full_name"
            },
            {
              "name": "is--company_size"
            }
          ],
          "primaryKey": "company_size"
        }
      },
      {
        "path": "ddf--entities--company--english_speaking.csv",
        "name": "ddf--entities--company--english_speaking",
        "schema": {
          "fields": [
            {
              "name": "english_speaking"
            },
            {
              "name": "is--english_speaking"
            },
            {
              "name": "name"
            }
          ],
          "primaryKey": "english_speaking"
        }
      },
      {
        "path": "ddf--entities--company--foundation.csv",
        "name": "ddf--entities--company--foundation",
        "schema": {
          "fields": [
            {
              "name": "foundation"
            },
            {
              "name": "is--foundation"
            }
          ],
          "primaryKey": "foundation"
        }
      },
      {
        "path": "ddf--entities--company.csv",
        "name": "ddf--entities--company",
        "schema": {
          "fields": [
            {
              "name": "company"
            },
            {
              "name": "name"
            },
            {
              "name": "country"
            },
            {
              "name": "region"
            }
          ],
          "primaryKey": "company"
        }
      },
      {
        "path": "ddf--entities--project.csv",
        "name": "ddf--entities--project",
        "schema": {
          "fields": [
            {
              "name": "project"
            },
            {
              "name": "name"
            }
          ],
          "primaryKey": "project"
        }
      },
      {
        "path": "ddf--entities--region.csv",
        "name": "ddf--entities--region",
        "schema": {
          "fields": [
            {
              "name": "region"
            },
            {
              "name": "full_name"
            }
          ],
          "primaryKey": "region"
        }
      }
    ]
  },
  "new": {
    "name": ".",
    "title": ".",
    "description": "",
    "version": "0.0.1",
    "language": {
      "id": "en",
      "name": "English"
    },
    "translations": [
      {
        "id": "nl-nl",
        "name": "nl-nl"
      }
    ],
    "license": "",
    "author": "",
    "resources": [
      {
        "path": "ddf--concepts.csv",
        "name": "ddf--concepts",
        "schema": {
          "fields": [
            {
              "name": "concept"
            },
            {
              "name": "concept_type"
            },
            {
              "name": "domain"
            },
            {
              "name": "additional_column"
            }
          ],
          "primaryKey": "concept"
        }
      },
      {
        "path": "ddf--datapoints--company_size--by--company--anno.csv",
        "name": "ddf--datapoints--company_size--by--company--anno",
        "schema": {
          "fields": [
            {
              "name": "company"
            },
            {
              "name": "anno"
            },
            {
              "name": "company_size"
            }
          ],
          "primaryKey": [
            "company",
            "anno"
          ]
        }
      },
      {
        "path": "ddf--datapoints--lines_of_code--by--company--anno.csv",
        "name": "ddf--datapoints--lines_of_code--by--company--anno",
        "schema": {
          "fields": [
            {
              "name": "company"
            },
            {
              "name": "anno"
            },
            {
              "name": "lines_of_code"
            }
          ],
          "primaryKey": [
            "company",
            "anno"
          ]
        }
      },
      {
        "path": "ddf--datapoints--lines_of_code--by--company--project--anno.csv",
        "name": "ddf--datapoints--lines_of_code--by--company--project--anno",
        "schema": {
          "fields": [
            {
              "name": "company"
            },
            {
              "name": "project"
            },
            {
              "name": "anno"
            },
            {
              "name": "lines_of_code"
            }
          ],
          "primaryKey": [
            "company",
            "project",
            "anno"
          ]
        }
      },
      {
        "path": "ddf--datapoints--lines_of_code--by--company--project.csv",
        "name": "ddf--datapoints--lines_of_code--by--company--project",
        "schema": {
          "fields": [
            {
              "name": "company"
            },
            {
              "name": "project"
            },
            {
              "name": "lines_of_code"
            }
          ],
          "primaryKey": [
            "company",
            "project"
          ]
        }
      },
      {
        "path": "ddf--datapoints--num_users--by--company--project.csv",
        "name": "ddf--datapoints--num_users--by--company--project",
        "schema": {
          "fields": [
            {
              "name": "company"
            },
            {
              "name": "project"
            },
            {
              "name": "longitude"
            },
            {
              "name": "latitude"
            },
            {
              "name": "num_users"
            }
          ],
          "primaryKey": [
            "company",
            "project"
          ]
        }
      },
      {
        "path": "ddf--entities--company--company_size.csv",
        "name": "ddf--entities--company--company_size",
        "schema": {
          "fields": [
            {
              "name": "company_size"
            },
            {
              "name": "full_name_changed"
            },
            {
              "name": "is--company_size"
            }
          ],
          "primaryKey": "company_size"
        }
      },
      {
        "path": "ddf--entities--company--english_speaking.csv",
        "name": "ddf--entities--company--english_speaking",
        "schema": {
          "fields": [
            {
              "name": "english_speaking"
            },
            {
              "name": "is--english_speaking"
            },
            {
              "name": "name"
            },
            {
              "name": "additional_column"
            }
          ],
          "primaryKey": "english_speaking"
        }
      },
      {
        "path": "ddf--entities--company--foundation.csv",
        "name": "ddf--entities--company--foundation",
        "schema": {
          "fields": [
            {
              "name": "foundation"
            },
            {
              "name": "is--foundation"
            }
          ],
          "primaryKey": "foundation"
        }
      },
      {
        "path": "ddf--entities--company.csv",
        "name": "ddf--entities--company",
        "schema": {
          "fields": [
            {
              "name": "company"
            },
            {
              "name": "name"
            },
            {
              "name": "country"
            },
            {
              "name": "region"
            }
          ],
          "primaryKey": "company"
        }
      },
      {
        "path": "ddf--entities--project.csv",
        "name": "ddf--entities--project",
        "schema": {
          "fields": [
            {
              "name": "project"
            },
            {
              "name": "name"
            }
          ],
          "primaryKey": "project"
        }
      },
      {
        "path": "ddf--entities--region.csv",
        "name": "ddf--entities--region",
        "schema": {
          "fields": [
            {
              "name": "region"
            },
            {
              "name": "full_name_changed"
            }
          ],
          "primaryKey": "region"
        }
      }
    ]
  }
};