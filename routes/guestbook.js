var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const { render } = require('../app');
const authorize = require('../helpers/jwt');
require('../helpers/dotenv');
var Guest = require('../models/GuestModel')
const Role = require('../helpers/role');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('guestbook')
});


router.post('/', function(req,res,next){
    const {
        nama_tamu,
        asal,
        tujuan
    } = req.body
    try{
        Guest({
            name : nama_tamu,
            organization: asal,
            intention : tujuan
        }).save()
        .then(guest => {
            res.render('responseMessage',{
                _messageTitle : 'Redirecting...',
                _message: "Terima kasih telah mengunjungi kami",
                _path: "/",
                _time : 1000
            })
            // res.send({
            //     message: 'Guest created successfully',
            //     guest,
            // })
        })
    } catch(err){
        res.send(err);
    }
})

router.get('/book', authorize(Role.Admin), function(req, res, next) {
    Guest.find({}, function(err, guests){
        res.render('guest-list', {
            role: 'Admin',
            guests
        });
    })
});

module.exports = router;
