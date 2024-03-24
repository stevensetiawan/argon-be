"use strict"
require('dotenv').config()
const express = require('express')
const app = express()
const session = require("express-session")
const path = require('path')
const cors = require('cors')
const router = require('./routes')
const {
  createClient
} = require("redis")
const RedisStore = require("connect-redis")(session)

app.enable("trust proxy")

app.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    message: "Testing"
  })
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static(path.join(__dirname + '/public')))

const redisClient = createClient({
  // host: process.env.REDIS_HOST,
  // port: process.env.REDIS_PORT,
  url: process.env.REDIS_URL,
  legacyMode: true
})
redisClient.connect().catch(console.error)

app.use(
  session({
    store: new RedisStore({
      client: redisClient
    }),
    secret: process.env.SECRET,
    resave: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000
    },
    saveUninitialized: false
  })
)

app.use('/api_argon/v1/auth', router)

module.exports = app