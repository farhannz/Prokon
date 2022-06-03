const Student = require('../models/StudentModel');
const jwt = require('jsonwebtoken');
const Role = require('../helpers/role');
const bcrypt = require('bcryptjs');
var mongodb = require('mongodb');
require('../helpers/dotenv');
var client = mongodb.MongoClient;
var url = process.env.DB_URL;
var dbName = process.env.DB_NAME;

const getAllStudents = function(req, res) {
    try{
      // console.log(req)
      if(req.cookies.token){
        Student.find({}, {nis: 1, name: 1, class_id : 1, email: 1, gender : 1, _id : 0},function(err, data){
          if(err)
            res.send(err);
          const response = {
            nis : data.nis, 
            name : data.name,
            class_id: data.class_id,
            email : data.email,
            gender : data.gender
          }
          res.send(data);
        });
      }
      else{
        res.send("Unauthorized")
      }
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
        password = bcrypt.hashSync(password,10)
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
        Student.findOne({ nis: req.body.nis})
        .then(student => {
          //console.log(req.body)
          //console.log(student.class_id)
            if(student){
              if(bcrypt.compareSync(req.body.password,student.password)){
                const token = jwt.sign({
                    aud: 'urn:audience:test',
                    iss: 'urn:issuer:test',
                    sub: false,
                    nis: student.nis,
                    nama: student.name,
                    kelas: student.class_id,
                    role: Role.Student, 
                  }, process.env.SECRET, {expiresIn : "4h"})
                console.log(token)
                if(token){
                  // res.set('authorization', "Bearer" + token)
                  res.cookie('token',token,{ httpOnly: true, secure: true})
                  res.redirect(301,'/')
                }
              }
              else{
                res.render('login', {_apiUrl : '/students/login', failedLogin: true})
              }
            }
            else{
              res.render('login', {_apiUrl : '/students/login', failedLogin: true})
            }
        })
    } catch(err){
      res.send(err);
    }
}

const getStudentByNIS = function(req, res) {
    console.log("debug - " + req)
    const nis = req.params.nis;
    try{
      Student.findOne({ nis },{nis: 1, name: 1, class_id : 1, email: 1, gender : 1, _id : 0}, function(err, data){
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


const checkInStudent = function(req, res){
  
  var payload = req.body;
  console.log(payload)

  if (payload.QRScanData) {
    client.connect(url,function(err,db){
      if(err) throw err
      dbo = db.db(dbName)
      // console.log(req.params)
      var query = { idKelas : payload.classStudent };
      dbo.collection("qrcodes").findOne(query,function(err,data){
          if(err) throw err
          // console.log(data)
          if(data){
            const { nis } = jwt.verify(req.cookies.token, process.env.SECRET)
            Student.findOne({ nis }, function(err, data){
              if(err) throw err
              if(data){
                // console.log(res)
                console.log(data)
                res.redirect(301, '/students/attendance')
                // res.render('attendance',)
              }
            })
            // res.render('', {

            // })

              // response.status = 'ok'
              // response.uri = data.uri
              // res.json(response)
          }
          else {
            res.send({})
          }
      });
    })
  }
  // decode = {
  //     Angkatan : req.angkatan,
  //     Pilihan : data.pilihan,
  //     Kelas   : data.kelas
  // }
  // console.log(bcrypt.compareSync(JSON.stringify(decode),data.secured))
  // res.json(payload)
  // res.json("Gagal")
}

const attendanceForm = function(req, res){
  const { nis } = jwt.verify(req.cookies.token, process.env.SECRET)
  Student.findOne({ nis }, function(err, data){
    if(err) throw err
    if(data){
      res.render('attendance', {
        _id: data._id,
        nama: data.nama,
        kelas: data.class_id,
      })
    }
  })
}


module.exports = { 
    getAllStudents, 
    createStudent, 
    studentLogin, 
    getStudentByNIS,
    updateStudentByNIS,
    checkInStudent,
    attendanceForm
};