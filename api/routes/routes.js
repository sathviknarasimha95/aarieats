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

  app.route('/placeorder')
    .post(controller.placeOrder1);

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
    .post(
      validator.validateGetProducts,
      controller.getProducts
    );


  app.route('/registervendor')
    .post(
      validator.validateRegisterVendor,
      controller.checkExistVendor,
      controller.registerVendor
    );

  app.route('/getorderuser')
    .get(
      controller.getOrderUser
    );
  app.route('/getuserorderdetails')
    .get(
      controller.getOrderDetailsUser
    );

  app.route('/getordervendor')
    .get(
      controller.getOrderVendor
    );

  app.route('/getvendororderdetails')
    .get(
      controller.getOrderDetailsVendor
    );

  app.route('/getvendors')
    .get(controller.getallvendors);
};
