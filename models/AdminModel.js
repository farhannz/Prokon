const mongoose = require('mongoose');

const { Schema } = mongoose;

const adminModel = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('admin', adminModel);