const mongoose = require('mongoose');

const { Schema } = mongoose;

const studentModel = new Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    nis: { type: String, required: true, index: { unique: true } },
    name: { type: String, required: true },
    class_id: { type: String, required: true },
    password: { type: String, required: true, index: { unique: true } },
    email: { type: String, required: true },
    gender: { type: String, enum: ['Perempuan', 'Laki-laki'], required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('student', studentModel);