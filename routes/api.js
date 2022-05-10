var qr = require('qrcode');
var express = require('express');
var mongodb = require('mongodb');
const { timeStamp } = require('console');
var bcrypt = require('bcryptjs');

var router = express.Router();


// router.use('/generate', (err,req,res,next) => {
//   res.status(400).send("Bad Request!");
// });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('API');
  });

function generateQR(req,res,next){

    /*
    Future Ideas :
        - Secure QRCode
        - Add QRCode styling, (SMAN1 Ciawi Bogor logo)??
    */
        console.log(req.ip)
    // Get Payload 
    var payload = req.body;
    var stringified = JSON.stringify(payload)
    // Stringify Payload and Encrypt it for better security
    var securePayload = bcrypt.hashSync(stringified,10)
    
    // console.log(payload)
    payload["time"] = Date.now(); //Milisecond
    // console.log(securePayload)
    var response = {status : "none", uri : "none"};
    qr.toDataURL(securePayload, {width : 400, height: 400},function(err,uri){
        if(err){
            response["status"] = "bad";
            response["error"] = err;
            res.redirect(400,"/");
        }
        else{
            // console.log(JSON.stringify(payload))
            // 
            // TO DO : Add/Update qrcode uri in the database
            // 
            var client = mongodb.MongoClient;
            var url = "mongodb://127.0.0.1:27017/"
            var dbName = "sysAttendance_Dev";

            client.connect(url, function(err,db){
                if(err)
                    res.redirect(400, "/");
                var dbo = db.db(dbName);
                var idKelas = payload.Angkatan + payload.Pilihan + payload.Kelas;

                var query = { idKelas : idKelas};
                var value = {
                    $setOnInsert : {
                        idKelas: idKelas,
                        angkatan: payload.Angkatan,
                        pilihan: payload.Pilihan,
                        kelas: payload.Kelas
                    },
                    $set : {
                        timeGenerated: payload["time"],
                        secured: securePayload,
                        uri : uri
                    }
                };
                dbo.collection("qrcode").updateOne(query,value,{upsert: true},function(err,res){
                    if(err) throw err;
                    // console.log(res);
                    db.close();
                });
            });
            response["status"] = "ok"
            response["uri"] = url;
            req.body = response;
            // console.log(response["status"])
            res.redirect(301,"/")
        }
    });
    //   res.send(res.json(req.body));
    // res.render('index', {title : 'Attendance System', qrcode : payload["QRData"]})  
}

router.post('/generate', generateQR);

router.get('/generate/:id', function(req,res, next){
    console.log(req.ip)
    var client = mongodb.MongoClient;
    var url = "mongodb://127.0.0.1:27017/"
    var dbName = "sysAttendance_Dev";
    var response = {
        status: 'none',
        uri: ""
     };

    client.connect(url,function(err,db){
        if(err) throw err
        dbo = db.db(dbName)
        // console.log(req.params)
        var query = { idKelas : req.params.id};
        dbo.collection("qrcode").findOne(query,function(err,data){
            if(err) throw err
            // console.log(data)
            if(data){
                response.status = 'ok'
                response.uri = data.uri
                decode = {
                    Angkatan : data.angkatan,
                    Pilihan : data.pilihan,
                    Kelas   : data.kelas
                }
                console.log(bcrypt.compareSync(JSON.stringify(decode),data.secured))
                res.json(response)
            }
            else res.send({})
        });
    })
    
})

router.post("/checkin", function(req,res,next){
    console.log(req.ip)
    var payload = req.body;
    res.json(payload)
});
module.exports = router;
