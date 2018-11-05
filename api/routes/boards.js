const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Project = require('../models/project');
const Task = require('../models/task');

router.get('/:board', (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({
            message: "Please log in"
        });
    }
    else {
        
        var open = false;

        if (req.query.view === 'true') {
            open = true;
        }

        Project.findById(req.params.board)
            .select('name ownerID projectTasks projectTeam')
            .exec()
            .then(docs => {
                var taskArray = docs.projectTasks;
                var taskIDs = taskArray.map(taskArray => taskArray._taskID);
                Task.find({
                    '_id': { $in: taskIDs }
                })
                    .exec()
                    .then(docss => {
                        const response = {
                            loggedIn: req.session.user,
                            count: docss.length,
                            projName: docs.name,
                            owner: docs.ownerID,
                            projTeam: docs.projectTeam,
                            sliderOpen: open,
                            activeTask: req.query.activetask,
                            Tasks: docss.map(doc => {
                                return {
                                    name: doc.name,
                                    description: doc.description,
                                    storyPoints: doc.storyPoints,
                                    stage: doc.stage,
                                    assignedUsers: doc.assignedUsers,
                                    id: doc._id,
                                    request: {
                                        type: 'GET',
                                        url: 'http://localhost:3000/project/' + req.params.board + '?view=true&activetask=' + doc._id
                                    }
                                }
                            })
                        };
                        res.send(response);
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({
                            error: err
                        })
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

router.put('/:board', (req, res) => {

    const taskID = req.query.activetask
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Task.update({ _id: taskID }, { $set: updateOps })
        .exec()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });

        })

});

module.exports = router;


