require('../helpers/dotenv');
var express = require('express');
var router = express.Router();
const { adminLogin } = require('../handlers/AdminHandler');
const role = require('../helpers/role');
const authorize = require('../helpers/jwt');
var fetch = require('node-fetch');


router.get('/login', function(req,res,next){
    if(!req.cookies.token){
        res.render('login', {
        role : "",
          _apiUrl : '/admin/login'
        })
    }
    else{
        res.redirect(301,'/admin')
    }
  });


  
router.get('/', authorize(role.Admin), function(req,res,next){
  var kelas ='XIPA1'
  var tampilanKelas = kelas
  console.log(req.body)
  if(req.cookies.kelas){
    kelas = req.cookies.kelas.Angkatan +  req.cookies.kelas.Pilihan + req.cookies.kelas.Kelas
    tampilanKelas = req.cookies.kelas.Angkatan + ' ' +  req.cookies.kelas.Pilihan + ' ' + req.cookies.kelas.Kelas;
  }
  if(req.cookies.token){
    const fetchedData = fetch('http://localhost:3000/api/generate/' + kelas)
      .then(res => res.json())
      .then(json => {
        return json;
      });
    const m_render = () => {
      fetchedData.then((json)=>{
        // console.log(json)
        qrcode = json["uri"]
        res.clearCookie("kelas")
        res.render('admin',{ 
          //   title         : 'Attendance System',
          //   textDebug     : "(Debugging & Development Envirionment)",
            qrcode        : qrcode ,
          //   angkatanData  : dummyData.angkatan,
          //   pilihanData   : dummyData.pilihan,
          //   kelasData     : dummyData.kelas,
          //   reqBody       : req.body.Angkatan,
            kelas        : tampilanKelas,
            role          : role.Admin,
          //   _nama         : nama
          }
        );
      })
    }
    m_render()
  }
  else{
      res.redirect(301,'/admin/login')
  }
});
router.post('/login', adminLogin);


module.exports = router;