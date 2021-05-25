const set = require('./uhppoted.js').set
const opcodes = require('./opcodes.js')
const errors = require('./errors.js')
const log = require('./logger.js')
const translate = require('./internationalisation.js').translate

const isValidDeviceId = require('./common.js').isValidDeviceId
const isValidEventIndex = require('./common.js').isValidEventIndex

function setEventIndex (ctx, deviceId, index) {
  const initialise = new Promise((resolve, reject) => {
    if (!isValidDeviceId(deviceId)) {
      reject(errors.InvalidDeviceID(deviceId, ctx.locale))
      return
    }

    if (!isValidEventIndex(index)) {
      reject(errors.InvalidEventIndex(index, ctx.locale))
      return
    }

    resolve({
      config: ctx.config,
      locale: ctx.locale,
      logger: ctx.logger ? ctx.logger : (m) => { log(m) }
    })
  })

  return initialise
    .then(context => set(context, deviceId, opcodes.SetEventIndex, { index: index }))
    .then(response => translate(response, ctx.locale))
}

exports = module.exports = setEventIndex
