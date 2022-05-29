var express = require('express');
const { METHODS } = require('http');
var qr = require('qrcode');
var jsQR = require('jsqr');
var router = express.Router();
var fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const authorize = require('../helpers/jwt');
require('../helpers/dotenv');


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.cookies.token){
      res.render('dashboard')
  }
  else{
      res.redirect(301,'/students/login')
  }
});

// router.post('/', function(req, res, next) {
//   var payload = req.body;
  
//   console.log(qrCode)
//   res.render('index', { title: 'Attendance System' });
// });
module.exports = router;
