'use strict';
require('dotenv').config()
const passport = require('passport');
const Strategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

// Setup work and export for the JWT passport strategy
passport.serializeUser((req, user, done) => {
  done(null, user)
})

passport.deserializeUser((req, user, done) => {
  done(null, user)
})

passport.use(
  new Strategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    },
    async (token, done) => {
      try {
        let expiration_date = new Date(token.exp * 1000)
        if (expiration_date < new Date()) {
          return done(null, false)
        }
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
)

const jwt_middleware = passport.authenticate('jwt', { session: false })

module.exports = {
  jwt_middleware
}