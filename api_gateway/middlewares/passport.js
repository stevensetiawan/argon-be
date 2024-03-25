'use strict';
const passport = require('passport');
const localStrategy = require('passport-local').Strategy
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const isValidPassword = require('../helpers/bcrypt').checker
const jwt = require('jsonwebtoken')
const Employee = require("../models")
const { sendResponse } = require('../helpers/response');

// Setup work and export for the JWT passport strategy
passport.serializeUser((req, user, done) => {
  done(null, user)
})

passport.deserializeUser((req, user, done) => {
  done(null, user)
})

passport.use(
  'login',
  new localStrategy({
    usernameField: 'email',
    passwordField: 'password',    
  },
    async (email, password, done) => {
      try {
        const user = await Employee.findOneByEmail({
          email: email
        })
        console.log(user,'ini user ya')
        
        if (!user) {
          console.log("masuk sini bkn?")
          return done(null, false, {
            message: 'User not found'
          })
        }

        const validate = await isValidPassword(password, user.password)

        if (!validate) {
          return done(null, false, {
            message: 'Wrong Password'
          })
        }
        return done(null, user, {
          message: 'Logged in Successfully'
        })
      } catch (error) {
        return done(error);
      }
    }
  )
)

exports.auth = async (req, res, next) => {
  passport.authenticate(
    'login',
    async (err, user, info) => {
      try {
        console.log(user,'ini user kan?')
        if (err) {
          console.log(err,'ini error')
          const error = new Error('An error occurred.');
          return next(error);
        } else if (!user) {
          const error = new Error(info.message);
          return next(error);
        }

        req.login(
          user, {
            session: false
          },
          async (error) => {
            if (error) return next(error);

            const body = {
              id: user.id,
              email: user.email,
              position: user.position,
              name: user.name,
              emp_photo: user.emp_photo
            }
            body.token = await jwt.sign({
              user: body
            }, process.env.SECRET, {
              expiresIn: 600000
            });

            console.log(user,'ini user')
            console.log({
              user: body
            },'ini user object')

            const result = {
              err: null,
              message: info.message,
              data: body,
              code: 200
            }
            return sendResponse(result, res);
          }
        );
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next)
}

passport.use(
  new JWTstrategy({
      secretOrKey: process.env.SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
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