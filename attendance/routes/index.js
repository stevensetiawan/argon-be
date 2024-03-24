"use strict"
const router = require('express').Router();
const Attendance = require('../controllers/index.js');
const passport = require('passport');
const uploader = require('../middlewares/uploader')



router.put('/:id', Attendance.absent);
router.get('/', Attendance.getAllAttendance);
// router.post('/:id', Attendance.getOneEmployee);
// router.put('/:id', uploader.single('image'), Employee.updateEmployee);
router.get('/:id', Attendance.getAllAttendanceByEmployee);

module.exports = router;