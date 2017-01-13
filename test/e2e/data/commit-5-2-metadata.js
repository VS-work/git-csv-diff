'use strict';

module.exports = {
  metaData: {
    fileName: 'lang/nl-nl/ddf--datapoints--meeting_type--popularity--methodology--by--company--project--anno.csv',
    fileModifier: 'M',
    datapackage: null
  },
  dataDiff: {
    from: 'company,project,anno,meeting_type,popularity,methodology\nmcrsft,xbox,2016,brainstorm,erg populair,worsteling om de bal\ngap,vizabi,2015,regelmatig,populair,kanban\ngap,vizabi,2016,spel,niet zo populair,mager\ngap,ws,2015,spel,niet zo populair,kanban\ngap,ws,2016,regelmatig,erg populair,worsteling om de bal\nvalor,ws,2015,regelmatig,erg populair,mager\nvalor,ws,2016,brainstorm,populair,worsteling om de bal\nzsoft,ws,2016,regelmatig,niet zo populair,worsteling om de bal\n',
    to: 'company,project,anno,meeting_type,methodology,popularity\nmcrsft,xbox,2016,brainstorm,worsteling om de bal,erg populair\ngap,vizabi,2015,regelmatig,kanban,populair\ngap,vizabi,2016,spel,mager,lage populariteit\ngap,ws,2015,spel,kanban,lage populariteit\ngap,ws,2016,regelmatig,worsteling om de bal,erg populair\nvalor,ws,2015,regelmatig,mager,erg populair\nvalor,ws,2016,brainstorm,worsteling om de bal,populair\nzsoft,ws,2016,regelmatig,worsteling om de bal,lage populariteit\n'
  },
  streams: {
    diff: null,
    lang: null
  }
};