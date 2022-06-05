require('../helpers/dotenv');
var express = require('express');
var router = express.Router();
const authorize = require('../helpers/jwt');
const Role = require('../helpers/role');
const { 
  getAllStudents, 
  createStudent, 
  studentLogin, 
  getStudentByNIS, 
  updateStudentByNIS,
  checkInStudent, 
  attendanceForm,
  absenceForm,
  getAllStudentsAttendances
} = require('../handlers/StudentHandler');

const {
  getAllStudentsAbsences,
} = require('../handlers/AbsenceHandler');

router.get('/login', function(req,res,next){
  if(!req.cookies.token){
    res.render('login', {
      _apiUrl : '/students/login',
      role : ""
    })
}
else{
    res.redirect(301,'/')
}
});
router.get('/create', authorize(Role.Admin), function (req, res) {
  res.render('create-students', {
    role : "Admin"
  })
})
router.get('/attendance', authorize(Role.Admin), getAllStudentsAttendances);
router.get('/absence', authorize(Role.Admin), getAllStudentsAbsences);
router.post('/login', studentLogin);
router.post('/', authorize(Role.Admin), createStudent);

router.get('/',authorize(Role.Admin), getAllStudents);
router.get('/:nis', authorize([Role.Admin, Role.Student]), getStudentByNIS);
router.patch('/:nis', authorize([Role.Admin, Role.Student]), updateStudentByNIS);
router.post('/checkin', authorize(Role.Student), checkInStudent);
router.post('/attendance', authorize(Role.Student), attendanceForm);
router.post('/absence', authorize(Role.Student), absenceForm);

module.exports = router;
