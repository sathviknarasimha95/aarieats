module.exports = function(app) {
  var controller = require('../controllers/controller');

  // todoList Routes
  app.route('/getusers')
    .get(controller.getallusers);
  app
    .route('/registeruser')
    .post(
      controller.checkExistUser,
      controller.registerUser
    );
  app.route('/registervendor')
    .post(
      controller.checkExistVendor,
      controller.registerVendor
    );
  app.route('/getvendors')
    .get(controller.getallvendors);
};
