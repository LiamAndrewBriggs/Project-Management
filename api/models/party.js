const mongoose = require('mongoose');

const partySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    //venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    //catering: { type: mongoose.Schema.Types.ObjectId, ref: 'Catering', required: true },
    //entertainment: { type: mongoose.Schema.Types.ObjectId, ref: 'Entertainment', required: true },
    //transport: { type: mongoose.Schema.Types.ObjectId, ref: 'Transport', required: true },
    invitedGuests: [{ type: mongoose.Schema.Types.ObjectId, ref:  'User' }],
    confirmedGuests: [{ type: mongoose.Schema.Types.ObjectId, ref:  'User' }],
    declinedGuests: [{ type: mongoose.Schema.Types.ObjectId, ref:  'User' }],
    invitedGuestsNames: [{ type: String}],
    confirmedGuestsNames: [{ type: String}],
    declinedGuestsNames: [{ type: String}]
});

module.exports = mongoose.model('Party', partySchema);

