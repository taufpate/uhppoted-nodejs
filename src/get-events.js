const get = require('./uhppoted.js').get
const opcodes = require('./opcodes.js')
const log = require('./logger.js')
const translate = require('./internationalisation.js').translate
const validate = require('./common.js').validate

function getEvents (ctx, deviceId) {
  const initialise = new Promise((resolve, reject) => {
    resolve({
      config: ctx.config,
      locale: ctx.locale,
      logger: ctx.logger ? ctx.logger : (m) => { log(m) }
    })
  })

  const first = validate({ deviceId: deviceId }, ctx.locale)
    .then(ok => initialise)
    .then(context => get(context, deviceId, opcodes.GetEvent, { index: 0 }))

  const last = validate({ deviceId: deviceId }, ctx.locale)
    .then(ok => initialise)
    .then(context => get(context, deviceId, opcodes.GetEvent, { index: 0xffffffff }))

  const promise = Promise.all([first, last]).then(([p, q]) => {
    const object = { first: 0, last: 0 }

    if (p && p.event) {
      object.first = p.event.index
    }

    if (q && q.event) {
      object.last = q.event.index
    }

    return object
  })

  return promise
    .then(response => translate(response, ctx.locale))
}

exports = module.exports = getEvents
