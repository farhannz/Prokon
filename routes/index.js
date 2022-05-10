var express = require('express');
const { METHODS } = require('http');
var qr = require('qrcode');
var router = express.Router();
var fetch = require('node-fetch')

var dummyData = {angkatan : ["10","11","12"], pilihan : ["IPA","IPS"], kelas : ["1","2","3","4"]}


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.body)
  // qrcode : get uri from db
  var qrcode = "";
  const fetchedData = fetch('http://localhost:3000/api/generate/10IPA1')
    .then(res => res.json())
    .then(json => {
      return json;
    });
  
  // console.log(fetchedData)
  
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
        kelasData     : dummyData.kelas
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
