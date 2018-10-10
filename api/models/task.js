const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    desciption: { type: Number, required: true },
    storyPoints:  { type: String, required: true },
    stage: { type: String, required: true }
});

module.exports = mongoose.model('Task', taskSchema);

