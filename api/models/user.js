const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    userLevel: { type: Number, required: true },
    partys: [{ type: mongoose.Schema.Types.ObjectId, ref:  'Party' }],
    invitedTo: [{
        partyID:  { type: mongoose.Schema.Types.ObjectId, ref:  'Party', required: true },
        name: { type: String, required: true },
        response: { type: String, required: true },
        date: {type: Date, required: true }
    }]
});

module.exports = mongoose.model('User', userSchema);

