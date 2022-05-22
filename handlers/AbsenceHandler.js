const Absence = require('../models/AbsenceModel');
const Student = require('../models/StudentModel');

const absence = function(req, res) {
    const {
        studentId,
        filepath,
    } = req.body

    try{
        Absence({
            studentId,
            filepath,
        })
        .save()
        .then(absence => {
            res.send({
                message: 'Absence data created successfully',
                absence,
            })
        })
    } catch(err){
        res.send(err);
    }
}

const getAllStudentsAbsences = function(req, res) {
    try{
        Absence.find({}, function(err, data){
            if(err)
                res.send(err);
            res.send(data);
        });
    } catch(err){
        res.send(err);
    }
}

const getStudentAbsencesByNIS = function(req, res) {
    const nis = req.params.nis;
    console.log(nis)
    try {
        Student.findOne({ nis }, function(err, student) {
            Absence.find({ studentId: student._id }, function(err, absences) {
                if(err)
                    res.send(err);
                res.send(absences);
            });
        });
    } catch(err){
        res.send(err);
    }
}


module.exports = { absence, getAllStudentsAbsences, getStudentAbsencesByNIS }