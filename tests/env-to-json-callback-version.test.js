const envToJSON = require('../src/env-to-json')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '../.env')
const envBakPath = path.join(__dirname, '../.env.bak')

function renameExistingEnvFileFn (callback) {
  fs.access(envPath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.rename(envPath, envBakPath, (err) => {
        if (err) throw err
        callback()
      })
    }
  })
}

function rollbackChangesFn (callback) {
  fs.access(envBakPath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.rename(envBakPath, envPath, (err) => {
        if (err) throw err
        callback()
      })
    }
  })
}

function createTestFileFn (data, callback) {
  fs.writeFile(envPath, data, (err) => {
    if (err) throw err
    callback()
  })
}

const fileData = 'DATABASE_HOST=192.168.1.1\nDATABASE_PORT=33060\nAPI_PORT=443\n'
const expectedData = {
  'api': {
    'port': 443
  },
  'database': {
    'host': '192.168.1.1',
    'port': 33060
  }
}
const notExpectedData = {
  'api': {
    'port': 443
  },
  'database': {
    'host': '192.168.1.1',
    'port': '33060'
  }
}

function runTestFn () {
  let response = envToJSON()
  let equal = _.isEqual(response, expectedData)
  equal = equal && !_.isEqual(response, notExpectedData)
  rollbackChangesFn(function () {
    if (equal) {
      console.log('Passed')
      process.exit(0)
    } else {
      console.log('Couldn\'t pass.', '\nResponse:\n', response, '\nExpected:\n', expectedData, '\nNot expected:\n', notExpectedData)
      process.exit(1)
    }
  })
}

renameExistingEnvFileFn(function () {
  createTestFileFn(fileData, runTestFn)
})
