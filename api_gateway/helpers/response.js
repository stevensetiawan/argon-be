const wrapper = require('./wrapper');

const sendResponse = async (result, res) => {
  // console.log("result: ", result);
  if(result.err){
    console.log(result.err,'ini result err')
    return wrapper.response(res, 'fail', result, result.message);
  }else{
    if(result.message){
      return wrapper.response(res, 'success', result, result.message);
    }else{
      return wrapper.response(res, 'success', result, 'Your request has been processed.');
    }
    
  }
  // return (result.err) ? wrapper.response(res, 'fail', result) :
  //   wrapper.response(res, 'success', result, 'Your request has been processed.');
    
};

const paginationResponse = async (result, res) => {
  return (result.err) ? wrapper.response(res, 'fail', result) :
    wrapper.paginationResponse(res, 'success', result, 'Your request has been processed.');
};


module.exports = {
  sendResponse,
  paginationResponse
};
