const envToJSON = require('./src/env-to-json')
const _ = require('lodash')

let config = {
  'api': {
    'port': 2999
  },
  'database': {
    'host': '127.0.0.1',
    'port': 3000
  }
}

config = _.merge(config, envToJSON())

console.log(config)

/*
Object.keys(val.parsed)
  .map(x => x.toLowerCase())
  .filter(x => x.)
*/
