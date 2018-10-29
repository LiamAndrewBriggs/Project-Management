const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ownerID: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    projectTeam: [{
        _userID:  { type: mongoose.Schema.Types.ObjectId, ref:  'User'},
        userName: { type: String, required: true },
    }],
    projectTasks: [{
        _taskID:  { type: mongoose.Schema.Types.ObjectId, ref:  'Task'}
    }]
});

module.exports = mongoose.model('Project', projectSchema);

