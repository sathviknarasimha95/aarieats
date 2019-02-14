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
