const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
  trip_name: {
    type: String,
    required: true,
    unique: true,
    min: 3,
  },
  trip_description: { type: String },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
})

//Virtual for Trip's URL
tripSchema.virtual('url').get(function () {
  return `/trips/${this._id}`
})

const Trip = mongoose.model('Trip', tripSchema)

module.exports = Trip
