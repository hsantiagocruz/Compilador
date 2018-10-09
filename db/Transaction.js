//methods for fetching mysql data  
var DB = require('../db/MySQLConnect');  
    
function Transaction() {   
    this.setUsuario = function (data, callback) {  
        DB.init(); 
        DB.acquire(function (err, con) {  
            con.query('SELECT * FROM usuario where email = ?',data["email"], function (err, result) {
                con.release(); 
                
                if(err)
                    callback("1", "Error DB")
                else{
                    if(result.length==0)
                        DB.acquire(function (err, con) {  
                            con.query('INSERT INTO usuario SET ?',data, function (err, result) {  
                                con.release(); 
                                console.log(err);
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
        console.log(data);
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
    this.getMundos = function (callback) {
        DB.init(); 
        DB.acquire(function (err, con) {
            con.query('SELECT * FROM mundo', function (err, result) {
                con.release(); 
                callback(err, result)
            });
        });
    };
    this.deleteMundo = function (data, callback) {
        DB.init(); 
        console.log(data["idmundo"]);
        DB.acquire(function (err, con) {
            con.query('DELETE FROM mundo WHERE idmundo= ?', data["idmundo"], function (err, result) {
                con.release(); 
                //console.log(err);
                //console.log(result);
                if(!err){
                    DB.acquire(function (err, con) {  
                        con.query('SELECT * FROM mundo', function (err, result){  
                            con.release(); 
                            callback(err, result)
                        });  
                    });
                }
                else
                    callback(err, result)
            });
        });
    };
    this.setTarea = function (data, callback) {
        DB.init(); 
        DB.acquire(function (err, con) {
            con.query('INSERT INTO tarea SET ?',data, function (err, result) {
                con.release(); 
                callback(err, result)
            });
        });
    };
    this.getTarea = function (data, callback) {
        DB.init(); 
        DB.acquire(function (err, con) {
            con.query('SELECT * FROM tarea WHERE idusuario='+data['idusuario']+' ORDER BY idtarea DESC', function (err, result) {
                console.log(result)
                con.release(); 
                callback(err, result)
            });
        });
    };
    this.getTareaAlumnos = function ( callback) {
        DB.init(); 
        DB.acquire(function (err, con) {
            con.query('SELECT usuario.nombre,usuario.apellidos, usuario.grupo,tarea.fecha, tarea.codigo,'+
                'tarea.mensages, tarea.mundo FROM  tarea LEFT JOIN usuario ON tarea.idusuario=usuario.idusuario'+
                ' ORDER BY fecha DESC', 
                function (err, result) {
                    con.release(); 
                    callback(err, result)
            });
        });
    };
    this.getAlumnos = function ( callback) {
        DB.init(); 
        DB.acquire(function (err, con) {
            con.query('SELECT usuario.idusuario,usuario.nombre,usuario.apellidos, usuario.grupo, usuario.email FROM  usuario WHERE rol LIKE "%user%"', 
                function (err, result) {
                    con.release(); 
                    callback(err, result)
            });
        });
    };
    this.deleteAlumno = function ( data, callback) {
        DB.init(); 
        DB.acquire(function (err, con) {
            con.query('DELETE FROM  usuario WHERE idusuario = ?', data["idusuario"], 
                function (err, result) {
                    con.release(); 
                    callback(err, result)
            });
        });
    };
    this.deleteAlumnos = function ( callback) {
        DB.init(); 
        DB.acquire(function (err, con) {
            con.query('DELETE FROM  usuario WHERE rol LIKE %user%', 
                function (err, result) {
                    con.release(); 
                    callback(err, result)
            });
        });
    };
}  
    
module.exports = new Transaction();  