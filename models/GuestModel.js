const mongoose = require('mongoose');

const { Schema } = mongoose;

const guestModel = new Schema(
    {
        name: { type: String, required: true },
        intention: { type: String, required: true },
        organization: { type: String, required: true }
      },
      {
        timestamps: true,
      },
);

module.exports = mongoose.model('guest', guestModel);