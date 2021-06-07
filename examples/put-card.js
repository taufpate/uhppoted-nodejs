const uhppoted = require('uhppoted')
const ctx = require('./common.js')

const deviceID = 405419896
const cardNumber = '123456789'
const validFrom = '2021-01-01'
const validUntil = '2025-01-01'
const doors = { 1: true, 2: false, 3: true, 4: true }

uhppoted.putCard(ctx, deviceID, cardNumber, validFrom, validUntil, doors)
  .then(response => {
    console.log('\nput-card:\n', response)
  })
  .catch(err => {
    console.log(`\n   *** ERROR ${err.message}\n`)
  })
