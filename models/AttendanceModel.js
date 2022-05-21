const mongoose = require('mongoose');

const { Schema } = mongoose;

const attendanceModel = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    healthId: { type: Schema.Types.ObjectId, ref: 'Health' },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('attendance', attendanceModel);