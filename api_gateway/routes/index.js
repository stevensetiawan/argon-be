"use strict"
const router = require('express').Router();
const passport = require('passport');
const { auth, logout } = require('../middlewares/passport');

router.post('/login', auth);

router.use(passport.authenticate('jwt', { session: true }));

router.get('/logout', (req, res) => {
  console.log(req.user)
  console.log("res:", res)
 
  req.logout(function(err) {
    if (err) { console.log(err)}
  });
  req.session.destroy((err) => {
    res.clearCookie('connect.sid');
    res.clearCookie('jwt');
  });
  const result = {
    err: null,
    message: "logout success",
    data: "logout success",
    code: 200
  }
  return res.send('Logged out successfully');
});

module.exports = router;