const set = require('./uhppoted.js').set
const opcodes = require('./opcodes.js')
const log = require('./logger.js')
const translate = require('./internationalisation.js').translate
const isValidDeviceId = require('./common.js').isValidDeviceId

function setListener (ctx, deviceId, address, port) {
  const initialise = new Promise((resolve, reject) => {
    if (!isValidDeviceId(deviceId)) {
      reject(new Error(`invalid device ID '${deviceId}'`))
      return
    }

    resolve({
      config: ctx.config,
      logger: ctx.logger ? ctx.logger : (m) => { log(m) }
    })
  })

  return initialise
    .then(context => set(context, deviceId, opcodes.SetListener, { address: address, port: port }))
    .then(response => translate(response, ctx.locale))
}

exports = module.exports = setListener
