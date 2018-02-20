const mongoose = require('mongoose');

const cateringSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    image:  { type: String, required: true },
    website:  { type: String, required: true },
    foodType:  { type: String, required: true }
});

module.exports = mongoose.model('Catering', cateringSchema);

