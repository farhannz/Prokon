var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
require('../helpers/dotenv');


/* GET home page. */
router.get('/', function(req, res, next) {
    const { nis, nama, kelas } = jwt.verify(req.cookies.token, process.env.SECRET)

    res.render('absence', 
    {
        _nis: nis,
        _nama: nama,
        _kelas: kelas,
    })
});

module.exports = router;
