'use strict';

function sendSuccess(res, data) {
  res.writeHead(200, { "Content-Type" : "json"});
  var output = { error: null, data: data };
  res.end(JSON.stringify(output) + "\n");
}

function sendFailure(res, server_code, err) {
  var code = (err.code) ? err.code : err.name;
  console.log('sendFailure - err:', err);
  res.writeHead(server_code, { "Content-Type" : "json"});
  res.end(JSON.stringify(err) + "\n");
}

exports.getallusers = function(req,res) {
  req.getConnection(function(err,connection){
    var sql = "SELECT * FROM users";
    connection.query(sql,function(err,rows){
      if(err) throw err;
      res.status(200).json(rows);
    })
  });
}

exports.registerUser = function(req,res) {
  req.getConnection(function(err,connection) {
    var data = req.body;
    var userName = data.username;
    var password = data.password;
    var email = data.email;
    var phno = data.phno;
    var post = {
      UserName:userName,
      Password:password,
      Email:email,
      Phno:phno
    };
    var sql = "INSERT INTO users SET ?";
    connection.query(sql,post,function(err,rows){
      if(err) throw err;
      var data = {
        status:"Registeration success"
      };
      sendSuccess(res,data);
    });
  });
}

exports.checkExistUser = function(req,res,next) {
  req.getConnection(function(err,connection){
    var data = req.body;
    var sql = "SELECT 1 FROM users WHERE Email = ?";
    connection.query(sql,[data.email],(err,rows)=>{
      if(err) throw err;
      if(rows.length > 0) {
        var data = {
          name : "User Already Exists",
        }
        sendFailure(res,409,data);
      } else {
        console.log("user not exists");
        next();
      }
    });
  });
}

exports.checkExistVendor = function(req,res,next) {
  req.getConnection(function(err,connection){
    var data = req.body;
    var sql = "SELECT 1 FROM vendors WHERE Email = ?";
    connection.query(sql,[data.email],(err,rows)=>{
      if(err) throw err;
      if(rows.length > 0) {
        var data = {
          name : "User Already Exists",
        }
        sendFailure(res,409,{ name : "User Already Exists"});
      } else {
        next();
      }
    });
  });
}

exports.registerVendor = function(req,res) {
  req.getConnection(function(err,connection){
    var data = req.body;
    var post = {
      VendorName : data.vendorname,
      UserName : data.username,
      Password : data.password,
      email : data.email,
      VendorAddress : data.address,
      VendorCity : data.city,
      VendorState : data.state,
      VendorPhno : data.phno,
      VendorLat : data.lat,
      VendorLng : data.lng
    }
    var sql = "INSERT INTO vendors SET ?";
    connection.query(sql,post,function(err,rows) {
      if(err) throw err;
      var data = {
        status:"Registeration success"
      };
      sendSuccess(res,data);
    });
  });
}

exports.login = function(req,res) {
  req.getConnection(function(err,connection){
	var email = req.body.email;
	var password = req.body.password;
	connection.query('SELECT * FROM users WHERE Email = ?',email,function(err,result){
				if(err) throw err;
				if(!result.length){
					var data = {
            status : "No such user found"
          }
          sendFailure(res,401,data);
				} else if(!(result[0].Password == password)) {
				    	var data = {
               status:"password_is_incorrect"
						   }
            sendFailure(res,401,data);
				  } else {
					 var data = {
                status: "login_successfull"
						}
            sendSuccess(res,data);
					}
			});
	});
};

exports.vendorlogin = function(req,res) {
  req.getConnection(function(err,connection){
	var email = req.body.email;
	var password = req.body.password;
	connection.query('SELECT * FROM vendors WHERE email = ?',email,function(err,result){
				if(err) throw err;
				if(!result.length){
					var data = {
            status : "No such user found"
          }
          sendFailure(res,401,data);
				} else if(!(result[0].Password == password)) {
				    	var data = {
               status:"password_is_incorrect"
						   }
            sendFailure(res,401,data);
				  } else {
					 var data = {
                status: "login_successfull"
						}
            sendSuccess(res,data);
					}
			});
	});
};

exports.getallvendors = function(req,res) {
  req.getConnection(function(err,connection){
    var sql = "SELECT * FROM vendors";
    connection.query(sql,function(err,rows){
      if(err) throw err;
      sendSuccess(res,rows);
    })
  });
}

exports.addProducts = function(req,res) {
  req.getConnection(function(err,connection){
    var email = req.body.email;
    var sql = "SELECT VendorId From vendors WHERE email = ?";
    connection.query(sql,email,function(err,rows){
      if(err) throw err;
      var vendorId = rows[0].VendorId;
      console.log(vendorId);
      var post = {
        //generate the product id in server itself
        ProductId : req.body.productId,
        ProductName : req.body.productName,
        ProductType : req.body.productType,
        ProductUnit : req.body.productUnit,
        ProductPrice : req.body.productPrice
      };
      var sql2 = "INSERT INTO products SET ?";
      connection.query(sql2,post,(err,rows)=>{
        if(err) sendFailure(res,500,err);
        var post2 = {
          VendorId : vendorId,
          ProductId : req.body.productId
        };
        var sql3 = "INSERT INTO productvendor SET ?";
        connection.query(sql3,post2,(err,rows)=>{
          if(err) sendFailure(res,500,err);
          sendSuccess(res,"success");
        });
      });
    });
  });
}

exports.getProducts = function(req,res) {
  req.getConnection((err,connection)=>{
    if(err) sendFailure(res,500,err);
    var vendorEmail = req.body.vendorEmail;
    var sql = "SELECT VendorId from vendors WHERE email = ?";
    connection.query(sql,vendorEmail,(err,rows)=>{
      if(err) sendFailure(res,500,err);
      if(rows.length > 0) {
        var vendorId = rows[0].VendorId;
        var sql2 = "select products.ProductId,products.ProductName,products.ProductType,products.ProductUnit,products.ProductPrice from products JOIN productvendor ON products.ProductId = productvendor.ProductId WHERE VendorId ="+vendorId;
        connection.query(sql2,vendorId,(err,rows)=>{
          if(err) sendFailure(res,500,err);
          sendSuccess(res,rows);
        })
      } else {
        sendFailure(res,404,"Email Not Exist");
      }
    })
  });
}
