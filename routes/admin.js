module.exports = (function() {
    'use strict';
    var admin = require('express').Router();
    

    admin.get('/loginadmin', function (req, res) {
      data={error: false}
      res.render('loginadmin',{ msg: data });
    });

    admin.get('/', function (req, res) {
      res.render('indexadmin');
    });

    return admin;
})();
