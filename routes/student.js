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
  checkInStudent 
} = require('../handlers/StudentHandler');

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
router.post('/login', studentLogin);

router.get('/',authorize(Role.Admin), getAllStudents);
router.post('/', authorize(Role.Admin), createStudent)
router.get('/:nis', authorize([Role.Admin, Role.Student]), getStudentByNIS);
router.patch('/:nis', authorize([Role.Admin, Role.Student]), updateStudentByNIS);
router.post('/checkin', authorize(Role.Student), checkInStudent);
module.exports = router;
