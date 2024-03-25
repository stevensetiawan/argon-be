"use strict"
const router = require('express').Router();
const Attendance = require('../controllers/index.js');
const {jwt_middleware} = require('../middlewares/passport.js');
const uploader = require('../middlewares/uploader')


router.use(jwt_middleware)

router.put('/:id', Attendance.absent);
router.get('/', Attendance.getAllAttendance);
router.get('/absent/:id', Attendance.getAbsentById);
// router.put('/:id', uploader.single('image'), Employee.updateEmployee);
router.get('/:id', Attendance.getAllAttendanceByEmployee);
router.put('/:id', Attendance.absent);

module.exports = router