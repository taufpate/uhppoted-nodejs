const errors = require('./errors.js')

function validate (args, locale) {
  return new Promise((resolve, reject) => {
    Object.entries(args).forEach(([k, v]) => {
      switch (`${k}`) {
        case 'deviceId':
          if (!isValidDeviceId(v)) {
            reject(errors.InvalidDeviceID(v, locale))
          }
          break

        case 'cardNumber':
          if (!isValidCardNumber(v)) {
            reject(errors.InvalidCardNumber(v, locale))
          }
          break

        case 'cardIndex':
          if (!isValidCardIndex(v)) {
            reject(errors.InvalidCardIndex(v, locale))
          }
          break

        case 'door':
          if (!isValidDoor(v)) {
            reject(errors.InvalidDoor(v, locale))
          }
          break

        case 'eventIndex':
          if (!isValidEventIndex(v)) {
            reject(errors.InvalidEventIndex(v, locale))
          }
          break
      }
    })

    resolve()
  })
}

function isValidDeviceId (deviceId) {
  return isValid(deviceId, 1, 4294967295)
}

function isValidCardNumber (card) {
  return isValid(card, 1, 4294967295)
}

function isValidCardIndex (index) {
  return isValid(index, 0, 4294967295)
}

function isValidDoor (door) {
  return isValid(door, 1, 4)
}

function isValidEventIndex (index) {
  return isValid(index, 0, 4294967295)
}

function isValid (value, min, max) {
  if (!value || Number.isNaN(value)) {
    return false
  }

  if (value < min || value > max) {
    return false
  }

  return true
}

module.exports = {
  validate: validate
}
