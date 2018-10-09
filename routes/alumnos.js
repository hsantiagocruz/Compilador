var express = require('express');
var alumno = express.Router();
var transactions = require('../db/transaction'); 
var cors = require('cors');
var jwt = require('jsonwebtoken');
var jwtDecode = require('jwt-decode');
var token;


alumno.use(cors());
process.env.SECRET_KEY = 'CKarelV1.0';

alumno.get('/registro', function(req, res, next) {
  data={error: false}
  res.render('registro', { msg: data });
});

alumno.post('/registro', function(req, res, next) {
  data ={
    "nombre":req.body.nombre,
    "apellidos":req.body.apellidos,
    "grupo":req.body.grupo,
    "rol":"user",
    "email":req.body.email,
    "password":req.body.pass
  }
  transactions.setUsuario(data, function(err, result){
    if(err){
      data={error: true, code:"Error", cont: result}
      res.render('registro', { msg: data });
    }
    else{
      data={error: false, code:"", cont: result}
      console.log("end");
      res.render('login',{msg:data});
    }
  });
});

alumno.get('/login', function(req, res, next) {
  data={error: false}
  res.render('login', { msg: data });
});

alumno.post('/login', function(req, res, next) {
  data ={
    "Email":req.body.email,
    "Password":req.body.pass
  }
  transactions.getUsuario(data, function(err, result){
    if(err){
      data={error: true, code:"Error", cont: result};
      res.render('login', { msg: data });
    }
    else{
      if(result[0].rol=="admin"){
        token = jwt.sign({uid:result[0].idusuario}, process.env.SECRET_KEY, {
          expiresIn: 3600
        });
        res.cookie("admin",token);
        res.redirect("/indexad");
      }
      else{
        token = jwt.sign({uid:result[0].idusuario}, process.env.SECRET_KEY, {
          expiresIn: 3600
        });
        res.cookie("token",token);
        res.redirect("/index");
      }
      //res.render('login',{});
    }
  });
  
});

alumno.use(function(req, res, next) {
  var token = req.cookies.token  || req.cookies.admin;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, function(err) {
        if (err) {
          data={error: true, code:"Error: ", cont: "Primero inicia una sesión"}
          res.render('login', { msg: data });
            //res.status(500).json(appData);
        } else {
          next();
        }
    });
  } else {
    data={error: true, code:"Error", cont: "Primero inicia una sesión"}
    res.render('login', { msg: data });
      //res.status(403).json(appData);
  }
});


//URLs Alumnos
alumno.get('/', function(req, res, next) {
  var token =  req.cookies.token;
  if (token) {
    res.render('index', { title: 'Compilador' });
  }
  else{
    res.redirect("/indexad");
  }
});

alumno.get('/index', function(req, res, next) {
  var token =  req.cookies.token;
  if (token) {
    res.render('index', { title: 'Compilador' });
  }
  else{
    res.redirect("/indexad");
  }
});

alumno.post('/index/tarea',function(req,res){
  var token =  req.cookies.token;
  if (token) {
    dataToken = jwtDecode(token);
    idUser=dataToken.uid;
    //console.log(req.body);
    //date=convertUTCDateToLocalDate(new Date());
    date=new Date();
    data={
      "idusuario":idUser,
      "fecha":date,
      "mensages":req.body.messages,
      "codigo":req.body.code,
      "mundoNombre":"",
      "mundo":req.body.mundo
    };
    console.log(data);
    transactions.setTarea(data, function(err, result){
      console.log(err);
      if(err)
        data={error: true, msg: "Error al enviar la tarea"};  
      else
        data={error: false, msg: "Tarea guardada"};
      return res.send(data);
    });
  }
  else{
    res.redirect("/indexad");
  }
});
alumno.get('/perfil', function(req, res, next) {
  var token =  req.cookies.token;
  if (token) {
    dataToken = jwtDecode(token);
    //console.log(dataToken.uid);
    data ={
      "Id":dataToken.uid
    };
    dataMsg=[];
    transactions.getUsuarioId(data, function(err, result){
      //console.log("per:"+result[0].Nombre);
      dataMsg={nombre:result[0].nombre+" "+result[0].apellidos, correo:result[0].email,grupo:result[0].grupo,tabla:[]};
      
    });
    var dataPr=[];
    data ={
      "idusuario":dataToken.uid
    };
    transactions.getTarea(data, function(err, result){
      dataMsg.tabla=[];
      //dataPr=result;
      for(i=0;i<result.length;i++){
        result[i].fecha=formatDate(result[i].fecha);
        dataMsg.tabla[i]={codigo:result[i].codigo,mensages:result[i].mensages,fecha:result[i].fecha};
        //console.log(result[i].codigo);
        //console.log(dataMsg.tabla[i]);
      }
      //dataMsg.tabla=dataMsg.tabla;

      console.log(dataMsg.tabla.length);
      res.render('perfil', { msg: dataMsg });
    });
    
    //res.render('perfil', { title: 'Perfil' });
  }
  else{
    res.redirect("/indexad");
  }
});
alumno.get('/logout', function(req, res, next) {
  data={error: false}
  res.clearCookie("token");
  res.clearCookie("admin");
  res.render('login', { msg: data });
});

//URLs Admin
alumno.get('/', function(req, res, next) {
  var token =  req.cookies.admin;
  if (token) {
    res.render('indexad', { title: 'Mundos' });
  }
  else{
    res.redirect("/index");
  }
});

alumno.get('/indexad', function(req, res, next) {
  var token =  req.cookies.admin;
  if (token) {
    res.render('indexad', { title: 'Mundos' });
  }
  else{
    res.redirect("/index");
  }
});
alumno.get('/mundos', function(req, res, next) {
  var token =  req.cookies.admin ;
  if (token) {
    res.render('mundos', {});
  }
  else{
    res.redirect("/index");
  }
});
alumno.post('/mundos/getMundos', function(req, res, next) {
  var token =  req.cookies.admin || req.cookies.token;
  if (token) {
    transactions.getMundos(function(err,result){
      if(err)
        data={error: true, msg: "Error al recuperar los mundos"}; 
      else{
        data={error: false, msg: result}; 
      }
      return res.send(data);
    });
  }
  else{
    res.redirect("/index");
  }
});
alumno.post('/mundos/deleteMundo', function(req, res, next) {
  var token =  req.cookies.admin;
  if (token) {
    data =req.body;
    transactions.deleteMundo(data, function(err,result){
      if(err)
        data={error: true, msg: "Error al recuperar los mundos"}; 
      else{
        data={error: false, msg: result}; 
      }
      return res.send(data);
    });
  }
  else{
    res.redirect("/index");
  }
});
alumno.post('/indexad/mundo',function(req,res){
  var token =  req.cookies.admin;
  if (token) {
    data ={
      "nombre":req.body.nombre,
      "codigo":req.body.mundo
    }
    transactions.setMundo(data, function(err, result){
      //console.log(result);
      if(err)
        data={error: true, msg: "Error al guardar el mundo"};  
      else
        data={error: false, msg: "Mundo guardo"};
      return res.send(data);
    });
  }
  else{
    res.redirect("/index");
  }
});
alumno.get('/alumnos', function(req, res, next) {
  var token =  req.cookies.admin ;
  if (token) {
    data=[]
    transactions.getTareaAlumnos(function(err,result){
      if(err)
        data={error: true, msg: "Error al recuperar informacion de alumnos"}; 
      else{
        data.error=false;
        data.tabla=[];
        //console.log(result);
        for(i=0;i<result.length;i++){
          result[i].fecha=formatDate(result[i].fecha);
          data.tabla[i]={codigo:result[i].codigo,mensages:result[i].mensages,fecha:result[i].fecha,
            nombre:result[i].nombre+ " " + result[i].apellidos, grupo:result[i].grupo, mundo:result[i].mundo};
        }
      }
      res.render('alumnos', { msg: data });
    });
  }
  else{
    res.redirect("/index");
  }
});
alumno.post('/alumnos/getMundoAlumno', function(req, res, next) {
  var token =  req.cookies.admin ;
  if (token) {
    data=[]
    transactions.getTareaAlumnos(function(err,result){
      console.log(err);
      if(err)
        data={error: true, msg: "Error al recuperar informacion de alumnos"}; 
      else{
        data={error: false, mundo: []};
        //console.log(result);
        for(i=0;i<result.length;i++){
          data.mundo.push(result[i].mundo);
        }
      }
      console.log(data.mundo[0]);
      return res.send(data);
    });
  }
  else{
    res.redirect("/index");
  }
});
alumno.get('/administrar', function(req, res, next) {
  var token =  req.cookies.admin ;
  if (token) {
    data=[]
    transactions.getAlumnos(function(err,result){
      if(err)
        data={error: true, msg: "Error al recuperar informacion de alumnos"}; 
      else{
        data={error: false, tabla: []};
        console.log(result);
        for(i=0;i<result.length;i++){
          data.tabla[i]={idusuario:result[i].idusuario,nombre:result[i].nombre+ " " + result[i].apellidos, grupo:result[i].grupo, email:result[i].email};
        }
        console.log("end");
      }
      res.render('administrar', {msg:data});
    });
  }
  else{
    res.redirect("/index");
  }
});
alumno.get('/eliminarAlumno/:id', async function(req, res, next) {
  var token =  req.cookies.admin ;
  if (token) {
    num=req.params.id;
    data ={
      "idusuario":parseInt(num,10)
    }
    console.log(data)
    transactions.deleteAlumno(data, function(err, result){
      console.log(result);
      console.log(err)
      if(err)
        data={error: true, msg: "Error al aliminar el alumno del sistema"};  
      else
        res.redirect("/administrar");
    });
  }
  else{
    res.redirect("/index");
  }
});
function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
      hora= d.getHours();
      minutos = d.getMinutes();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('-')+"\n"+ hora+":"+minutos;
}
module.exports = alumno;
