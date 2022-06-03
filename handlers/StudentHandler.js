const Student = require('../models/StudentModel');
const Health = require('../models/HealthModel');
const Attendance = require('../models/AttendanceModel');
const Absence = require('../models/AbsenceModel');
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
          // console.log(payload)
          console.log(data)
          if(data && payload.QRScanData == data.secured){
            const { nis, nama, kelas } = jwt.verify(req.cookies.token, process.env.SECRET)
            Student.findOne({ nis }, {_id: 0, password: 0}, function(err, data){
              if(err) throw err
              if(data){
                // console.log(res)
                console.log(data)
                // res.redirect(301, '/students/attendance')
                res.render('attendance',{
                    _nama: nama,
                    _kelas: kelas,
                    _nis: nis,
                  })
              }
            })
          }
          else {
            res.render('responseMessage',{
              _messageTitle : 'Redirecting...',
              _message: "QRCode yang Anda scan tidak sesuai dengan kelas Anda! Berpindah dalam 1 detik...",
              _path: "/scanner",
              _time : 1000
            })
          }
      });
    })
  }
}

const attendanceForm = function(req, res){
  console.log(req.body);

  Student.findOne({ nis: req.body.nis }, function(err, data){
    if(err) throw err
    if(data){
      Health({
        studentId: data._id,
        student_condition: req.body.kondisi_siswa == "sehat" ? true : false,
        family_condition: req.body.kondisi_keluarga == "sehat" ? true : false,
      }).save()
      .then(health => {
        Attendance({
          studentId: health.studentId,
          healthId: health._id,
        }).save()
        .then(attendance => {
            res.send({
                message: 'Attendance submitted successfully',
                attendance,
            })
        })
      })
    }
  })
}

const absenceForm = function(req, res){
  console.log(req.body);

  Student.findOne({ nis: req.body.nis }, function(err, data){
    if(err) throw err
    if(data){
      Health({
        studentId: data._id,
        student_condition: req.body.kondisi_siswa == "sehat" ? true : false,
        family_condition: req.body.kondisi_keluarga == "sehat" ? true : false,
      }).save()
      .then(health => {
        Absence({
          studentId: health.studentId,
          healthId: health._id,
          description: req.body.description,
        }).save()
        .then(absence => {
            res.send({
                message: 'Absence submitted successfully',
                absence,
            })
        })
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
    attendanceForm,
    absenceForm
};