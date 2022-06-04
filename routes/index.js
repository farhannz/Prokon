var express = require('express');
const { METHODS } = require('http');
var qr = require('qrcode');
var jsQR = require('jsqr');
var router = express.Router();
var fetch = require('node-fetch');
const { default: adapter } = require('webrtc-adapter');
const jwt = require('jsonwebtoken');
const authorize = require('../helpers/jwt');
const role = require('../helpers/role');
var dummyData = {angkatan : ["X","XI","XII"], pilihan : ["IPA","IPS"], kelas : ["1","2","3","4"]}
require('../helpers/dotenv');
const Checkout = require('../models/CheckoutModel');
const Student = require('../models/StudentModel');

router.post('/logout',function(req,res,next){
  res.clearCookie("token")
  res.clearCookie("kelas")
  res.redirect(301,'/')
})


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.ip)
  console.log(process.env.SECRET)
  var kelas = "10IPA1"
  
  kelas = req.query.Angkatan+req.query.Pilihan+req.query.Kelas;
  // Debug
  if(!Object.keys(req.query).length) kelas = "10IPA1312"
  console.log(Object.keys(req.query).length)
  
  //  = req.session.kelas
  // console.log(req.session.kelas)
  // qrcode : get uri from db
  var qrcode = "";
  var role = ""
  var nama = "John Doe"
  console.log(req.cookies)
  if(req.cookies.token){
    var decoded = jwt.verify(req.cookies.token, process.env.SECRET)
    console.log(decoded)
    role = decoded.role
    if(role === 'Student'){
      kelas = decoded.kelas.replace(/\s/g, '')
      nama = decoded.nama
    }
    else if(role === "Admin"){
      nama = "Admin"
      kelaS = "Admin"
    }
  }

  const fetchedData = fetch('http://localhost:3000/api/generate/' + kelas)
    .then(res => res.json())
    .then(json => {
      return json;
    });
  const m_render = () => {
    fetchedData.then((json)=>{
      // console.log(json)
      qrcode = json["uri"]
       res.render('main-test'
      , { 
      //   title         : 'Attendance System',
      //   textDebug     : "(Debugging & Development Envirionment)",
      //   qrcode        : qrcode ,
      //   angkatanData  : dummyData.angkatan,
      //   pilihanData   : dummyData.pilihan,
      //   kelasData     : dummyData.kelas,
      //   reqBody       : req.body.Angkatan,
      //   _kelas        : kelas,
         role          : role,
      //   _nama         : nama
       }
      );
    })
  }
  m_render()
});

router.get('/checkout', authorize(role.Student), function(req, res){
  const { nis } = jwt.verify(req.cookies.token, process.env.SECRET);
  Student.findOne({nis: nis}, function(err, student){
    if(err){
      console.log(err)
    }
    else{
      Checkout({
        studentId : student._id
      }).save(function(err, checkout){
        if(err){
          console.log(err)
        }
        else{
          res.render('responseMessage',{
            _messageTitle : 'Redirecting...',
            _message: "Anda telah berhasil checkout",
            _path: "/dashboard",
            _time : 1000
          })
        }
      })
    }
  })
})
// router.post('/', function(req, res, next) {
//   var payload = req.body;
  
//   console.log(qrCode)
//   res.render('index', { title: 'Attendance System' });
// });
module.exports = router;
