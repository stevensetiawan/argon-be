
const data = (data, description = '', code = 200) => ({ err: null, message: description, data, code });

const paginationData = (data, meta, description = '', code = 200) => ({ err: null, message: description, data, meta, code });

const error = (err, description, code = 500) => ({ err, code, data: '', message: description });

const response = (res, type, result, message, code) => {
  
  if (message) {
    result.message = message;
  }
  if (code) {
    result.code = code;
  }
  let status;
  switch (type) {
  case 'fail':
    status = false;
    break;
  case 'success':
    status = true;
    break;
  default:
    status = true;
    break;
  }
  
  const response = {
    success: status,
    data: result.data,
    message: result.message,
    code: result.code
  };
  
  res.status(result.code);
  res.json(response);
  
};

const paginationResponse = (res, type, result, message = null, code = null) => {
  if (message) {
    result.message = message;
  }
  if (code) {
    result.code = code;
  }
  let status;
  switch (type) {
  case 'fail':
    status = false;
    break;
  case 'success':
    status = true;
    break;
  default:
    status = true;
    break;
  }
  res.send(result.code,
    {
      success: status,
      data: result.data,
      meta: result.meta,
      code: result.code,
      message: result.message
    }
  );
};

module.exports = {
  data,
  error,
  response,
  paginationData,
  paginationResponse
};
