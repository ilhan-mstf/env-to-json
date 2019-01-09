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
console.log(config)

let val = require('dotenv').config().parsed
console.log(val)
console.log(Object.keys(val))

let keys = Object.keys(val)
let obj = {}
for (let i = 0, ii = keys.length; i !== ii; i++) {
  val[keys[i]] = isNaN(val[keys[i]]) ? val[keys[i]] : Number(val[keys[i]])
  let lowerKey = keys[i].toLowerCase()
  let key = lowerKey.substring(0, lowerKey.indexOf('_'))
  let subKey = lowerKey.substring(lowerKey.indexOf('_') + 1)
  console.log(key, subKey)
  if (obj[key]) {
    obj[key][subKey] = val[keys[i]]
  } else {
    obj[key] = {}
    obj[key][subKey] = val[keys[i]]
  }
}
console.log(obj)

config = _.merge(config, obj)
console.log(config)

/*
Object.keys(val.parsed)
  .map(x => x.toLowerCase())
  .filter(x => x.)
*/
