require('../helpers/dotenv');
var express = require('express');
var router = express.Router();
const { adminLogin } = require('../handlers/AdminHandler');

router.post('/login', adminLogin);

module.exports = router;