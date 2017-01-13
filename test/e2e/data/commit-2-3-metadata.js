'use strict';

module.exports = {
  metaData: {
    fileName: 'ddf--datapoints--lines_of_code--by--company--project--anno.csv',
    fileModifier: 'M',
    datapackage: null
  },
  dataDiff: {
    from: 'company,project,anno,lines_of_code\nmic,xbox,2015,62493\nmic,xbox,2016,49595\ngap,vizabi,2015,439549\ngap,vizabi,2016,479679\ngap,ws,2015,56994\ngap,ws,2016,59383\nvalor,ws,2015,34857\nvalor,ws,2016,9877\n',
    to: 'company,project,anno,lines_of_code\nmcrsft,xbox,2015,62493\nmcrsft,xbox,2016,52222\ngap,vizabi,2015,439549\ngap,vizabi,2016,479679\ngap,ws,2014,52111\ngap,ws,2015,56994\ngap,ws,2016,62222\nvalor,ws,2015,34857\nvalor,ws,2016,11111\n'
  },
  streams: {
    diff: null,
    lang: null
  }
};