var express = require('express'),
  connection = require('express-myconnection'),
  mysql = require('mysql');
  app = express(),
  port = process.env.PORT || 8087;
  bodyParser = require('body-parser');
  app.use(

    connection(mysql,{

        host: 'localhost',
        user: 'root',
        password : 'root',
        database:'aarieats'
    },'request')
);




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/routes');
routes(app);


app.listen(port);

console.log('aarieats RESTful API server started on: ' + port);
