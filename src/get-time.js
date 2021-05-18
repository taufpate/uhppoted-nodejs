const uhppoted = require('./uhppoted.js')
const opcodes = require('./opcodes.js')
const log = require('./logger.js')
const validateDeviceId = require('./common.js').validateDeviceId

function getTime (ctx, deviceId) {
  validateDeviceId(deviceId)

  const context = {
    config: ctx.config,
    logger: ctx.logger ? ctx.logger : (m) => { log(m) }
  }

  return uhppoted.get(context, deviceId, opcodes.GetTime, {})
}

exports = module.exports = getTime
