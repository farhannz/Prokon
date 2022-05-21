const Student = require('../models/StudentModel');
const jwt = require('jsonwebtoken');
const Role = require('../helpers/role');

const getAllStudents = function(req, res) {
    try{
      Student.find({}, function(err, data){
        if(err)
          res.send(err);
        res.send(data);
      });
    } catch(err){
      res.send(err);
    }
};

const createStudent = function(req, res) {
    const {
        nis,
        name,
        class_id,
        password,
        email,
        gender
    } = req.body

    try{
        Student({
            nis,
            name,
            class_id,
            password,
            email,
            gender
        }).save()
        .then(student => {
            res.send({
                message: 'Student created successfully',
                student,
            })
        })
    } catch(err){
        res.send(err);
    }
}

const studentLogin = function(req, res) {
    try{
        Student.findOne({ email: req.body.email, password: req.body.password }).exec()
        .then(student => {
            const token = jwt.sign({
                aud: 'urn:audience:test',
                iss: 'urn:issuer:test',
                sub: false,
                email: student.email,
                role: Role.Student, 
              }, process.env.SECRET)
            
            console.log(token)
            res.send({ token })
        })
    } catch(err){
      res.send(err);
    }
}

const getStudentByNIS = function(req, res) {
    const nis = req.params.nis;
    try{
      Student.findOne({ nis }, function(err, data){
        if(err)
          res.send(err);
        res.send(data);
      });
    } catch(err){
      res.send(err);
    }
};

const updateStudentByNIS = function(req, res) {
    const nis = req.params.nis;

    try{
        Student.findOneAndUpdate({ nis }, req.body, { new: true }, function(err, data){
            if(err)
                res.send(err);
            res.send(data);
        });
    } catch(err){
        res.send(err);
    }
};

module.exports = { 
    getAllStudents, 
    createStudent, 
    studentLogin, 
    getStudentByNIS,
    updateStudentByNIS 
};