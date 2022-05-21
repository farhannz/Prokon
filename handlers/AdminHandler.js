const Admin = require('../models/AdminModel');
const jwt = require('jsonwebtoken');
const Role = require('../helpers/role');

const adminLogin = function(req, res) {
    try{
        Admin.findOne({ email: req.body.email, password: req.body.password }).exec()
        .then(admin => {
            const token = jwt.sign({
                aud: 'urn:audience:test',
                iss: 'urn:issuer:test',
                sub: false,
                email: admin.email,
                role: Role.Admin, 
              }, process.env.SECRET)
            
            console.log(token)
            res.send({ token })
        })
    } catch(err){
      res.send(err);
    }
}

module.exports = { adminLogin }