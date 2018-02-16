const mongoose = require('mongoose');

const partySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true }
    //invitedGuests: { type: String, required: true },
    //confirmedGuests
    //maybeGuests
    //declinedGuests
});

module.exports = mongoose.model('Party', partySchema);

