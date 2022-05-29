const Admin = require('../models/AdminModel');
const jwt = require('jsonwebtoken');
const Role = require('../helpers/role');
const bcrypt = require('bcryptjs')
const adminLogin = function(req, res) {
    try{
        Admin.findOne({ email: req.body.email }).exec()
        .then(admin => {
            if(admin){
              // console.log(req.body.password)
              if(bcrypt.compareSync(req.body.password,admin.password))
              {
                // console.log(bcrypt.compareSync(req.body.password,admin.password))
                console.log("====Admin====")
                console.log(admin)
                const token = jwt.sign({
                    aud: 'urn:audience:test',
                    iss: 'urn:issuer:test',
                    sub: false,
                    email: admin.email,
                    role: Role.Admin, 
                  }, process.env.SECRET, {expiresIn : "4h"})
                  console.log(token)
                if(token){
                  // res.header('authorization',token)
                  res.cookie('token',token,{ httpOnly: true, secure: true})
                  res.redirect(301,'/admin')
                }
              }
              else{
                res.render('login', {_apiUrl : '/admin/login', failedLogin: true})
              }
            }
            else{
              res.render('login', {_apiUrl : '/admin/login', failedLogin: true})
            }
            // res.send({ token })
        })
    } catch(err){
      res.send(err);
    }
}

module.exports = { adminLogin }