require('../helpers/dotenv');
var express = require('express');
var router = express.Router();
const { adminLogin } = require('../handlers/AdminHandler');


router.get('/login', function(req,res,next){
    if(!req.cookies.token){
        res.render('login', {
          _apiUrl : '/admin/login'
        })
    }
    else{
        res.redirect(301,'/')
    }
  });
router.post('/login', adminLogin);

module.exports = router;