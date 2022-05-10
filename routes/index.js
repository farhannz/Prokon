var express = require('express');
const { METHODS } = require('http');
var qr = require('qrcode');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.body)
  // qrcode : get uri from db
  res.render('index', { title: 'Attendance System' });
});

// router.post('/', function(req, res, next) {
//   var payload = req.body;
  
//   console.log(qrCode)
//   res.render('index', { title: 'Attendance System' });
// });

module.exports = router;
