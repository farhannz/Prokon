const mongoose = require('mongoose');

const { Schema } = mongoose;

const healthModel = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'student' },
    student_condition: { type: Boolean, required: true },
    family_condition: { type: Boolean, required: true  },
    temperature: { type: Number, required: true  },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('health', healthModel, "healths");