const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    storyPoints:  { type: Number, required: true },
    stage: { type: String, required: true },
    assignedUsers: [{
        _userID:  { type: mongoose.Schema.Types.ObjectId, ref:  'User'},
        userName: { type: String, required: true },
    }]
});

module.exports = mongoose.model('Task', taskSchema);

