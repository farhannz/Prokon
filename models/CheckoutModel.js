const mongoose = require('mongoose');

const { Schema } = mongoose;

const checkoutModel = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('checkout', checkoutModel);