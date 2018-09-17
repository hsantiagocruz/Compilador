    //methods for fetching mysql data  
    var DB = require('../db/MySQLConnect');  
      
    function Transaction() {   
        this.setUsuario = function (data, callback) {  
            DB.init(); 
            DB.acquire(function (err, con) {  
                con.query('SELECT * FROM usuario where email = ?',data["Email"], function (err, result) {
                    con.release(); 
                    if(err)
                        callback("1", "Error DB")
                    else{
                        if(result.length==0)
                            DB.acquire(function (err, con) {  
                                con.query('INSERT INTO usuario SET ?',data, function (err, result) {  
                                    con.release(); 
                                    callback(err, result)
                                });  
                            });
                        else
                            callback("2", "Ya esta registrado este correo")
                    }
                });  
            });
            
        };  
        
        this.getUsuario = function (data, callback) {
            DB.init(); 
            DB.acquire(function (err, con) {
                con.query('SELECT * FROM usuario where email = ?',data["Email"], function (err, result) {
                    con.release();
                    if(err)
                        callback("1", "Error DB");
                    else{
                        if(result.length==0)
                            callback("2", "El correo "+ data["Email"]+" no está registrado");
                        else{
                            if(result[0].password===data.Password)
                                callback(err, result);
                            else
                                callback("3", "La contraseña es incorrecta");
                        }
                    }
                });
            });
        };
        this.getUsuarioId = function (data, callback) {
            DB.init(); 
            DB.acquire(function (err, con) {
                con.query('SELECT * FROM usuario where idUsuario = ?',data["Id"], function (err, result) {
                    con.release();
                    if(err)
                        callback("1", "Error DB");
                    else{
                        if(result.length==0)
                            callback("2", "Id no encontrado");
                        else
                            callback(err, result);
                    }
                });
            });
        };
        this.setMundo = function (data, callback) {
            DB.init(); 
            DB.acquire(function (err, con) {
                con.query('INSERT INTO mundo SET ?',data, function (err, result) {
                    con.release(); 
                    callback(err, result)
                });
            });
        };
        this.getMundo = function (data, callback) {
            DB.init(); 
            DB.acquire(function (err, con) {
                con.query('SELECT * FROM mundo', function (err, result) {
                    con.release(); 
                    callback(err, result)
                });
            });
        };
    }  
      
    module.exports = new Transaction();  