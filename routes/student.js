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
  updateStudentByNIS 
} = require('../handlers/StudentHandler');

router.get('/', getAllStudents);
router.post('/', authorize(Role.Admin), createStudent)
router.post('/login', studentLogin);
router.get('/:nis', authorize([Role.Admin, Role.Student]), getStudentByNIS);
router.patch('/:nis', authorize([Role.Admin, Role.Student]), updateStudentByNIS);

module.exports = router;
