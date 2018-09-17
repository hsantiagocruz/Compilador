//Conección con la Base de datos Mysql 
var mysql = require('mysql');  

/*var connection = mysql.createPool({
  connectionLimit: 100,
  host:'localhost',
  user:'root',
  password:'12345',
  database:'compiladorkareldb',
  port: 3306,
  debug: false,
  multipleStatements: true
});

module.exports.connection = connection;*/
function MySQLConnect() {  
  
  this.pool = null;  
    
  // Init MySql  
  this.init = function() {  
    this.pool = mysql.createPool({  
      connectionLimit: 20,  
      host     : 'localhost',  
      user     : 'root',  
      password : '12345',  
      database: 'kareldb'  
    });  
  };  
  
  // acquire connection and execute query on callbacks  
  this.acquire = function(callback) {  
  
    this.pool.getConnection(function(err, connection) {  
      callback(err, connection);  
    });  
  
  };  
  
}  
module.exports = new MySQLConnect(); 