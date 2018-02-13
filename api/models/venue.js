const mongoose = require('mongoose');

const venueSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    capactity: { type: Number, required: true },
    location: { type: String, required: true }
});

module.exports = mongoose.model('Venue', venueSchema);

