require('../helpers/dotenv');
var express = require('express');
var router = express.Router();
const { adminLogin } = require('../handlers/AdminHandler');
const role = require('../helpers/role');
const authorize = require('../helpers/jwt');

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
  if(req.cookies.token){
      res.render('admin', {
      role : role.Admin
      })
  }
  else{
      res.redirect(301,'/admin/login')
  }
});
router.post('/login', adminLogin);


module.exports = router;