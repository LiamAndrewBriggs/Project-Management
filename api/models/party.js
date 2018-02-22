const mongoose = require('mongoose');

const partySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue'},
    catering: { type: mongoose.Schema.Types.ObjectId, ref: 'Catering'},
    entertainment: { type: mongoose.Schema.Types.ObjectId, ref: 'Entertainment' },
    transport: { type: mongoose.Schema.Types.ObjectId, ref: 'Transport' },
    invitedGuests: [{
        _userID:  { type: mongoose.Schema.Types.ObjectId, ref:  'User' },
        userName: { type: String, required: true },
        response: { type: String, required: true }
    }]
});

module.exports = mongoose.model('Party', partySchema);

