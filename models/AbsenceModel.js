const mongoose = require('mongoose');

const { Schema } = mongoose;

const absenceModel = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    healthId: { type: Schema.Types.ObjectId, ref: 'Health' },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('absence', absenceModel);