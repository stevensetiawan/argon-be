"use strict"
const jwt = require('jsonwebtoken');

const library = {
  sign: async (data) => {
    return await jwt.sign(data, process.env.SECRET, {
      expiresIn: 60
    })
  },

  verify: async (authorization, cb) => {
    return await jwt.verify(authorization, process.env.SECRET, cb)
  }
}
module.exports = library