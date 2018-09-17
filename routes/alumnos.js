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
    "Nombre":req.body.nombre,
    "Apellidos":req.body.apellidos,
    "Grupo":req.body.grupo,
    "Rol":"user",
    "Email":req.body.email,
    "Password":req.body.pass
  }
  transactions.setUsuario(data, function(err, result){
    if(err){
      data={error: true, code:"Error", cont: result}
      res.render('registro', { msg: data });
    }
    else{
      res.render('login',{});
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
        token = jwt.sign({uid:result[0].idUsuario}, process.env.SECRET_KEY, {
          expiresIn: 3600
        });
        res.cookie("admin",token);
        res.redirect("/indexad");
      }
      else{
        token = jwt.sign({uid:result[0].idUsuario}, process.env.SECRET_KEY, {
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
    console.log(req.body);
    res.render('index', { title: 'Compilador' });
  }
  else{
    res.redirect("/indexad");
  }
});

alumno.get('/perfil', function(req, res, next) {
  var token =  req.cookies.token;
  if (token) {
    dataToken = jwtDecode(token);
    data ={
      "Id":dataToken.uid
    };
    transactions.getUsuarioId(data, function(err, result){
      //console.log("per:"+result[0].Nombre);
      data={nombre:result[0].Nombre+" "+result[0].Apellidos, correo:result[0].Email,grupo:result[0].Grupo};
      res.render('perfil', { msg: data });
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

alumno.post('/indexad/mundo',function(req,res){
  var token =  req.cookies.admin;
  if (token) {
    dataToken = jwtDecode(token);
    idUser=dataToken.uid;
    console.log(req.body);
    data ={
      "nombre":req.body.nombre,
      "codigo":req.body.mundo
    }
    transactions.setMundo(data, function(err, result){
      console.log(result);
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
module.exports = alumno;
