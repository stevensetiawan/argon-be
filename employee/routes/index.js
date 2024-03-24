"use strict"
const router = require('express').Router();
const Attendance = require('../controllers/index.js');
const passport = require('passport');
const uploader = require('../middlewares/uploader')

require('../middlewares/passport.js')(passport)

// router.get('/', Employee.getAllProfile);
router.get('/:id', passport.authenticate('jwt', { session: false }), Employee.getProfile);
router.post('/', uploader.single('image'), Employee.createNewOne);
router.put('/:id', Attendance.absent);
// router.put('/:id', Employee.deleteEmployee);

module.exports = router;