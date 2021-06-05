const describe = require('mocha').describe
const before = require('mocha').before
const after = require('mocha').after
const it = require('mocha').it
const expect = require('chai').expect

const uhppoted = require('../index.js')
const ctx = require('./common.js').context
const dgram = require('dgram')

const requests = [
  Buffer.from([
    0x17, 0xb0, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]),
  Buffer.from([
    0x17, 0xb0, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ])
]

const replies = [
  Buffer.from([
    0x17, 0xb0, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x01, 0x00, 0x00, 0x00, 0x02, 0x01, 0x01, 0x01,
    0x00, 0x00, 0x00, 0x00, 0x20, 0x19, 0x07, 0x09, 0x21, 0x00, 0x55, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]),
  Buffer.from([

    0x17, 0xb0, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x46, 0x00, 0x00, 0x00, 0x02, 0x01, 0x03, 0x01,
    0xea, 0xac, 0xcd, 0xe9, 0x20, 0x21, 0x05, 0x28, 0x15, 0x40, 0x47, 0x2c, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ])
]

describe('#getEvents(...)', function () {
  let sock = null

  before(function () {
    sock = dgram.createSocket({ type: 'udp4', reuseAddr: true })

    sock.on('message', (message, rinfo) => {
      for (let i = 0; i < 2; i++) {
        if (message.equals(requests[i])) {
          sock.send(new Uint8Array(replies[i]), 0, 64, rinfo.port, rinfo.address)
        }
      }
    })

    sock.bind({ address: '0.0.0.0', port: 59999 })
  })

  after(function () {
    sock.close()
  })

  it('should execute get-events', function (done) {
    const expected = {
      deviceId: 405419896,
      first: 1,
      last: 70
    }

    uhppoted.getEvents(ctx, 405419896)
      .then(response => {
        expect(response).to.deep.equal(expected)
        done()
      })
      .catch(err => done(err))
  })
})
