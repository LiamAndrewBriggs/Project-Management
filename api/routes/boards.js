const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Project = require('../models/project');
const Task = require('../models/task');

router.get('/:board', (req, res) => {

    console.log(req.params.board);
    console.log(req.query);

    var userID = req.session.user._id;

    if (!req.session.user) {
        return res.status(401).json({
            message: "Please log in"
        });
    }
    else {
        var query = JSON.stringify(req.query);
        const response = {
            loggedIn: req.session.user
        };
        res.send(response);
    }
});

router.post('/:board', (req, res) => {

    const task = new Task({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        storyPoints: req.body.storyPoints,
        stage: req.body.stage,
        assignedUsers: req.body.assignedUsers
    });

    if (!req.session.user) {
        return res.status(401).json({
            message: "Please log in"
        });
    }
    else {
        task.save()
        .then(result => {
            res.send({
                express: 'Created Task',
                Task: {
                    name: result.name,
                    description: result.description,
                    storyPoints: result.storyPoints,
                    stage: result.stage,
                    assignedUsers: result.assignedUsers,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/' + req.body.url + "view=true&activetask=" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        });
    }
});

module.exports = router;


