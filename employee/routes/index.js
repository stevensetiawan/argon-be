"use strict"
const router = require('express').Router();
const Employee = require('../controllers/index.js');
const {jwt_middleware}= require('../middlewares/passport.js');
const uploader = require('../middlewares/uploader')
const jwt = require('../helpers/jwt.js')

router.use(jwt_middleware)
router.get('/', Employee.getAllEmployee);
router.get('/:id', Employee.getProfile);
router.post('/', uploader.single('image'), Employee.createNewOne);
router.put('/:id', uploader.single('image'), Employee.updateEmployee);
// router.put('/:id', Employee.deleteEmployee);

module.exports = router;