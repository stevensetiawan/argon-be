"use strict"
const Employee = require('../models/index');
const { sendResponse, paginationResponse } = require('../helpers/response');
const imagekit = require('../lib/imagekit');
const Producer = require("../message-broker/producer");
const producer = new Producer();
const fcm = require('../lib/firebase')



exports.createNewOne = async (req, res, next) => {
  try {
    console.log('userData: ', req.body);
    if(req.file){
      console.log('masuk ga sini?')
      const split = req.file.originalname.split('.');
      const ext = split[split.length - 1];
      const image = await imagekit.upload({
        file: req.file.buffer,
        fileName: `IMG-${Date.now()}.${ext}`
      })

      await Employee.createNewOne(req.body, image.url);
      const result = {
        message: "success create new data",
        code: 200
      }
      return sendResponse(result, res);
    } else {
      console.log('masuk ga sini? 2')
      await Employee.createNewOne(req.body, null);
      const result = {
        message: "success create new data",
        code: 200
      }
      return sendResponse(result, res);
    }
   
      const error = new Error("Gender Not Found");
      return next(error);
    
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

exports.getAbsent = async (req, res, next) => {
  try {
   
    const data = {
      id: req.params.id
    }
    const employee = await Employee.findAbsentById(data)
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

exports.getAllEmployee = async (req, res, next) => {

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
    const resList  = await Employee.getDataPagination(showentry, page, order, key, search); 

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
          data.id, payload, image.url, {
            returnOriginal: false
          }
        )

        await producer.publishMessage('updateLog', result);

        const message = {
          notification: {
            title: 'Update Employee',
            body: `Employee ${result.name} just updated`,
          },
          token: 'device_token_or_registration_token',
        };
        
        fcm.send(message)
          .then(response => {
            console.log('Successfully sent message:', response);
          })
          .catch(error => {
            console.error('Error sending message:', error);
          });
       
        return res.status(200).send({
          message: "Employee is updated",
          data: result
        })
        
      } else {
        console.log("masuk sini 2")

        const payload = req.body
        console.log(payload,req.body, 'ini apyload')
        const result = await Employee.updateEmployee(
          data.id, req.body, employee.emp_photo, {
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