"use strict"
const Employee = require('../models/index');
const { sendResponse, paginationResponse } = require('../helpers/response');
const imagekit = require('../lib/imagekit');
const isValidPassword = require('../helpers/bcrypt').checker
const jwt = require('jsonwebtoken')


exports.login = async (req, res, next) => {
  try {
    const user = await Employee.findOneByEmail({
      email: req.body.email
    })
    
    if (!user) {
      console.log("masuk sini bkn?")
      return done(null, false, {
        message: 'User not found'
      })
    }

    const validate = await isValidPassword(req.body.password, user.password)

    if (!validate) {
      return done(null, false, {
        message: 'Wrong Password'
      })
    }
    const body = {
      id: user.id,
      email: user.email
    }
    const token = await jwt.sign({
      user: body
    }, process.env.SECRET, {
      expiresIn: 600000
    });

    return res.json({
      token
    })
  } catch (error) {
    return next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
   
    const data = {
      id: req.params.id
    }
    const employee = await Employee.findOneById(data)
    if (employee) {
      const result = {
        data: employee,
        code: 200
      }
      return sendResponse(result, res);
      
    } else {
      const error = new Error("User Id Not Found");
      return next(error);
    }
    

  } catch (err) {
    console.log(err);
    return next(err);
  }
};

exports.getCustomerId = async (req, res, next) => {
  try {
   
    const data = {
      id: req.params.id
    }
    const user = await Customer.findOneById(data)
    if (user) {
      const result = {
        data: user,
        code: 200
      }
      return sendResponse(result, res);
      
    } else {
      const error = new Error("User Id Not Found");
      return next(error);
    }
    

  } catch (err) {
    console.log(err);
    return next(err);
  }
};

exports.getCustomers = async (req, res, next) => {

  try {
    console.log('masuk ga?')
    const showentry = parseInt (req.query.showentry); //rows
    const page = parseInt(req.query.page); //page ke berapa
    const order = req.query.order; //desc asc
    const key = req.query.key; //field for orders
    const search = req.query.search;

    console.log("show_entries: ", showentry);
    console.log("page: ", page);
    console.log("order: ", order);
    console.log("key: ", key);
    console.log("search: ", search);


     
    // List Data 
    const resList  = await Customer.getDataPagination(showentry, page, order, key, search); 

    const result = {
      code : 200,
      data : resList
    
    }
     
    return paginationResponse(result, res);
     
  } catch (err) {
    console.log(err);
    return next(err);
  }
     
};

exports.getAllCustomer = async (req, res, next) => {

  try {
    
    // List Data 
    const resList  = await Customer.getAllCustomer(); 
    
    if(resList){
      const result = {
        code : 200,
        data: {
          total_data: resList.length,
          customer: resList
        }
      }  
      return sendResponse(result, res);

    }else{
      throw new Error('Something Error When Get Data Customer');
    }
    
    
     
  } catch (err) {
    console.log(err);
    return next(err);
  }
     
};

exports.updateEmployee = async (req, res) => {
  try {
    const data = {
      id: req.params.id
    }
    const employee = await Employee.findOneById(data)
    if (employee) {
      if(req.file){
        console.log('masuk ga sini?')
        const split = req.file.originalname.split('.');
        const ext = split[split.length - 1];
        const image = await imagekit.upload({
          file: req.file.buffer,
          fileName: `IMG-${Date.now()}.${ext}`
        })
  
        const payload = req.body
        const result = await Employee.updateEmployee(
          data.id, payload, image, {
            returnOriginal: false
          }
        )
       
        return res.status(200).send({
          message: "Employee is updated",
          data: result
        })
        
      } else {
        console.log("masuk sini 2")

        const payload = req.body
        const result = await Employee.updateEmployee(
          data.id, payload, employee.emp_photo, {
            returnOriginal: false
          }
        )
        if (!result) {
          return res.status(404).send({
            message: "Employee is not found"
          })
        } else {
          return res.status(200).send({
            message: "Employee is updated",
            data: result
          })
        }
      }
    } else {
      return res.status(404).send({
        message: "Employee is not found"
      })
    }
    
    
  } catch (err) {
    return res.status(409).send({
      message: err.message || "Error to update User"
    })
  }
};