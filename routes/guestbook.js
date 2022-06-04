var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const { render } = require('../app');
require('../helpers/dotenv');
var Guest = require('../models/GuestModel')

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

module.exports = router;
