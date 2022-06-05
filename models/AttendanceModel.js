const mongoose = require('mongoose');

const { Schema } = mongoose;

const attendanceModel = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'student' },
    healthId: { type: Schema.Types.ObjectId, ref: 'health' },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('attendance', attendanceModel);