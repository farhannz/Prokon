var express = require('express');
const { METHODS } = require('http');
var qr = require('qrcode');
var jsQR = require('jsqr');
var router = express.Router();
var fetch = require('node-fetch');
const { default: adapter } = require('webrtc-adapter');

var dummyData = {angkatan : ["10","11","12"], pilihan : ["IPA","IPS"], kelas : ["1","2","3","4"]}

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.ip)
  req.session.kelas = "10IPA1"

  req.session.kelas = req.query.Angkatan+req.query.Pilihan+req.query.Kelas;
  // Debug
  if(!Object.keys(req.query).length) req.session.kelas = "10IPA1"
  console.log(Object.keys(req.query).length)

  
  console.log(req.session.kelas)
  // qrcode : get uri from db
  var qrcode = "";
  const fetchedData = fetch('http://localhost:3000/api/generate/' + req.session.kelas)
    .then(res => res.json())
    .then(json => {
      return json;
    });

  const m_render = () => {
    fetchedData.then((json)=>{
      // console.log(json)
      qrcode = json["uri"]
      res.render('index', { 
        title         : 'Attendance System',
        textDebug     : "(Debugging & Development Envirionment)",
        qrcode        : qrcode ,
        angkatanData  : dummyData.angkatan,
        pilihanData   : dummyData.pilihan,
        kelasData     : dummyData.kelas,
        reqBody       : req.body.Angkatan,
        _kelas        : req.session.kelas,
      });
    })
  }
  m_render()
});

// router.post('/', function(req, res, next) {
//   var payload = req.body;
  
//   console.log(qrCode)
//   res.render('index', { title: 'Attendance System' });
// });
module.exports = router;
