const mongoose = require('mongoose');

const transportSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: String, required: true },
    location: { type: String, required: true },
    image:  { type: String, required: true },
    website:  { type: String, required: true },
    mincarsize:  { type: Number, required: true },
    maxcarsize:  { type: Number, required: true }
});

module.exports = mongoose.model('Transport', transportSchema);

