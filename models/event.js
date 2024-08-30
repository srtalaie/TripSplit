const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  event_name: {
    type: String,
    required: true,
    min: 3,
  },
  event_description: { type: String },
  payee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  payers: [
    {
      payer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      split: {
        type: Number,
        required: true,
      },
      user_owed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
  ],
  cost: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
})

//Virtual for Event's URL
eventSchema.virtual('url').get(function () {
  return `/events/${this._id}`
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
