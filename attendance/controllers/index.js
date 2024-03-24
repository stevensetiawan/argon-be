"use strict"
const Absent = require('../models/index');
const { sendResponse, paginationResponse } = require('../helpers/response');
const imagekit = require('../lib/imagekit');

exports.absent = async (req, res, next) => {
  try {
    console.log('userData: ', req.body);
    const id = req.params.id
    const hasAbsent = await Absent.findOneToday(id)

    if(hasAbsent){
      const updateClockOut = Absent.updateClockOut(hasAbsent.id)

      const result = {
        message: "success update data",
        code: 200
      }
      return sendResponse(result, res)
    } else {
      await Absent.createNewAttendance(id);
      const result = {
        message: "success create new data",
        code: 201
      }
      return sendResponse(result, res)
    }

      
    
  } catch (error) {
    return next(error);
  }
};




exports.getAllAttendanceByEmployee = async (req, res, next) => {
  try {
    const showentry = parseInt (req.query.showentry); //rows
    const page = parseInt(req.query.page); //page ke berapa
    const key = req.query.key;
    const order = req.query.order; //desc asc
    const search = req.query.search;
    const category = req.query.category;
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;
    const id = req.params.id

    console.log("show_entries: ", showentry);
    console.log("page: ", page);
    console.log("order: ", order);
    console.log("search: ", search);

    const payload = {
      showentry: showentry,
      page: page,
      key: key,
      order: order,
      search: search,
      category: category,
      start_date: start_date,
      end_date: end_date
    }
     
    // List Data 
    const resList  = await Absent.getAllAttendancebyEmployee(payload, id); 

      
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

exports.getCustomerId = async (req, res, next) => {
  try {
   
    const data = {
      id: req.params.id
    }
    const showentry = parseInt (req.query.showentry); //rows
    const page = parseInt(req.query.page); //page ke berapa
    const key = req.query.key;
    const order = req.query.order; //desc asc
    const search = req.query.search;
    const category = req.query.category;
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;

    console.log("show_entries: ", showentry);
    console.log("page: ", page);
    console.log("order: ", order);
    console.log("search: ", search);

    const payload = {
      showentry: showentry,
      page: page,
      key: key,
      order: order,
      search: search,
      category: category,
      start_date: start_date,
      end_date: end_date
    }
     
    // List Data 
    const resList  = await Transaction.getAllAttendancebyEmployee(payload); 

      
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

exports.getAllAttendance = async (req, res, next) => {

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
    const resList  = await Absent.getDataPagination(showentry, page, order, key, search); 

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