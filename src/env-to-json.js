module.exports = function () {
  function converToNumberIfItIsNumber (val) {
    return isNaN(val) ? val : Number(val)
  }

  let obj = {}
  const dotenv = require('dotenv')
  const envVars = dotenv.config().parsed
  if (envVars) {
    let keys = Object.keys(envVars)

    for (let i = 0, ii = keys.length; i !== ii; i++) {
      envVars[keys[i]] = converToNumberIfItIsNumber(envVars[keys[i]])

      let lowerKey = keys[i].toLowerCase()
      let key = lowerKey.substring(0, lowerKey.indexOf('_'))
      let subKey = lowerKey.substring(lowerKey.indexOf('_') + 1)
      obj[key] = obj[key] || {}
      obj[key][subKey] = envVars[keys[i]]
    }
  }
  return obj
}
