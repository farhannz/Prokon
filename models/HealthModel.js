const mongoose = require('mongoose');

const { Schema } = mongoose;

const healthModel = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    description: { type: String, required: true },
    filepath: { type: String },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('health', healthModel);