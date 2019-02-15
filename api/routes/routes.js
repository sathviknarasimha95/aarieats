module.exports = function(app) {
  var controller = require('../controllers/controller');
  var validator = require('../validators/validator');

  // aarieats Routes
  app.route('/loginuser')
    .post(
      validator.validateLoginUser,
      controller.login
    );

  app.route('/loginvendor')
    .post(
      validator.validateLoginVendor,
      controller.vendorlogin
    );

  app.route('/getusers')
    .get(controller.getallusers);


  app
    .route('/registeruser')
    .post(
      validator.validateRegisterUser,
      controller.checkExistUser,
      controller.registerUser
    );

  app
    .route('/addproducts')
    .post(
      validator.validateAddProducts,
      controller.addProducts
    );

  app
    .route('/getproducts')
    .get(
      validator.validateGetProducts,
      controller.getProducts
    );


  app.route('/registervendor')
    .post(
      validator.validateRegisterVendor,
      controller.checkExistVendor,
      controller.registerVendor
    );


  app.route('/getvendors')
    .get(controller.getallvendors);
};
