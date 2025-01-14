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
      },
      split: {
        type: Number,
      },
      user_owed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
  return `/${this.trip._id}/events/${this._id}`
})

eventSchema.set('toObject', { virtuals: true })
eventSchema.set('toJSON', { virtuals: true })

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
