var qr = require('qrcode');
var express = require('express');
const { timeStamp } = require('console');

var router = express.Router();


// router.use('/generate', (err,req,res,next) => {
//   res.status(400).send("Bad Request!");
// });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('API');
  });

function generateQR(req,res,next){
    // console.log(req.body);
    //   res.send("Haiyaa");
    var payload = req.body;
    payload["time"] = Date.now(); //Milisecond

    var response = {status : "none", uri : "none"};
    qr.toDataURL(JSON.stringify(payload), {width : 400, height: 400},function(err,url){
        if(err){
            response["status"] = "bad";
            response["error"] = err;
        }
        response["status"] = "ok"
        response["uri"] = url;
        req.body = response;
        res.send(response);
        // 
        // TO DO : Add/Update qrcode uri in the database
        // 
        // console.log(response);
    });
    //   res.send(res.json(req.body));
    // res.render('index', {title : 'Attendance System', qrcode : payload["QRData"]})  
}

router.post('/generate', generateQR);

router.get('/generate/:id', function(req,res, next){
    var dummyData = {
        status: 'ok',
        uri: 'data:image/png;base64,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'
      };
    res.json(dummyData);
})

module.exports = router;
