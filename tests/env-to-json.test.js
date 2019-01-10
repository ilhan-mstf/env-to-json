const envToJSON = require('../src/env-to-json')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '../.env')
const envBakPath = path.join(__dirname, '../.env.bak')
const fsPromises = fs.promises

async function renameExistingEnvFile () {
  // Check existing file
  try {
    await fsPromises.access(envPath, fs.constants.F_OK)
    // Exists, move
    await fsPromises.rename(envPath, envBakPath)
  } catch (e) {
    // Not exist
  }
}

async function rollbackChanges () {
  try {
    await fsPromises.access(envBakPath, fs.constants.F_OK)
    // Exists, move
    await fsPromises.rename(envBakPath, envPath)
  } catch (e) {
    // Not exist
  }
}

async function createTestFile (data) {
  await fsPromises.writeFile(envPath, data)
}

async function test (fileData) {
  await renameExistingEnvFile()
  await createTestFile(fileData)
  let result = envToJSON()
  await rollbackChanges()
  return result
}

async function runTests (tests) {
  for (let i = 0, ii = tests.length; i != ii; i++) {
    let response = await test(tests[i].fileData)
    if (!_.isEqual(response, tests[i].expectedData)) {
      console.log('Couldn\'t pass.', '\nResponse:\n', response, '\nExpected:\n', tests[i].expectedData)
      process.exit(1)
    }
  }
  console.log('Passed', tests.length, 'cases.')
  process.exit(0)
}

runTests([
  {
    fileData: 'DATABASE_HOST=192.168.1.1\nDATABASE_PORT=33060\nAPI_PORT=443\n',
    expectedData: {
      'api': {
        'port': 443
      },
      'database': {
        'host': '192.168.1.1',
        'port': 33060
      }
    }
  },
  {
    fileData: '',
    expectedData: {}
  }
])
