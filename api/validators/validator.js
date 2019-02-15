'use strict';

const { check, validationResult,body } = require('express-validator/check');

function sendFailure(res, server_code, err) {
  var code = (err.code) ? err.code : err.name;
  console.log('sendFailure - err:', err);
  res.writeHead(server_code, { "Content-Type" : "json"});
  res.end(JSON.stringify(err) + "\n");
}

exports.validateRegisterUser = [
  check('email').isEmail().exists(),
  check('username').exists(),
  check('password').exists(),
  check('phno').exists(),
  function(req,res,next) {
    var errors = validationResult(req);
    console.log(errors.array());
    if(!errors.isEmpty()) {
      sendFailure(res,422,errors.array());
    } else {
      next();
    }
  }
];

exports.validateRegisterVendor = [
  check('email').isEmail().exists(),
  check('vendorname').exists(),
  check('username').exists(),
  check('password').exists(),
  check('address').exists(),
  check('city').exists(),
  check('state').exists(),
  check('phno').exists(),
  check('lat').exists(),
  check('lng').exists(),
  function(req,res,next) {
    var errors = validationResult(req);
    console.log(errors.array());
    if(!errors.isEmpty()) {
      sendFailure(res,422,errors.array());
    } else {
      next();
    }
  }
];

exports.validateLoginUser = [
  check('email').isEmail().exists(),
  check('password').exists(),
  function(req,res,next) {
    var errors = validationResult(req);
    console.log(errors.array());
    if(!errors.isEmpty()) {
      sendFailure(res,422,errors.array());
    } else {
      next();
    }
  }
];

exports.validateLoginVendor = [
  check('email').isEmail().exists(),
  check('password').exists(),
  function(req,res,next) {
    var errors = validationResult(req);
    console.log(errors.array());
    if(!errors.isEmpty()) {
      sendFailure(res,422,errors.array());
    } else {
      next();
    }
  }
];

exports.validateAddProducts = [
  check('email').isEmail().exists(),
  check('productId').exists(),
  check('productName').exists(),
  check('productType').exists(),
  check('productUnit').exists(),
  check('productPrice').exists(),
  function(req,res,next) {
    console.log("camehere");
    var errors = validationResult(req);
    if(!errors.isEmpty()) {
      sendFailure(res,422,errors.array());
    } else {
      next();
    }
  }
];

exports.validateGetProducts = [
  check('vendorEmail').isEmail().exists(),
  function(req,res,next) {
    var errors = validationResult(req);
    if(!errors.isEmpty()) {
      sendFailure(res,422,errors.array());
    } else {
      next();
    }
  }
]
