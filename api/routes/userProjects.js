const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Project = require('../models/project');
const User = require('../models/user');

router.get('/', (req, res, next) => {

    if (!req.session.user) {
        return res.status(401).json({
            message: "Please log in"
        });
    }
    else {
        User.findById(req.session.user._id)
            .select('userProjects projects')
            .exec()
            .then(docs => {
                Project.find({
                    '_id': { $in: docs.userProjects }
                })
                    .select('name description endDate _id')
                    .exec()
                    .then(docss => {
                        var projIDs = docs.projects.map(proj => proj.projectID);
                        Project.find({
                            '_id': { $in: projIDs }
                        })
                            .select('name _id')
                            .exec()
                            .then(docsss => {
                                const response = {
                                    loggedIn: req.session.user,
                                    count: docss.length,
                                    Projects: docss.map(doc => {
                                        return {
                                            name: doc.name,
                                            description: doc.description,
                                            date: doc.endDate,
                                            _id: doc._id,
                                            request: {
                                                type: 'GET',
                                                url: 'http://localhost:3000/user/dashboard/project/' + doc._id
                                            }
                                        }
                                    }),
                                    UserProjects: docsss.map(doc => {
                                        return {
                                            name: doc.name,
                                            _id: doc._id,
                                            request: {
                                                type: 'GET',
                                                url: 'http://localhost:3000/project/' + doc._id + '?view=false&activetask=none'
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
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            });
    }
});

router.get('/allProjects', (req, res, next) => {

    if (!req.session.user) {
        return res.status(401).json({
            message: "Please log in"
        });
    }
    else {
        Project.find({})
            .select('name description endDate _id projectTeam projectTasks')
            .exec()
            .then(docs => {
                const response = {
                    loggedIn: req.session.user,
                    count: docs.length,
                    Projects: docs.map(doc => {
                        return {
                            name: doc.name,
                            description: doc.description,
                            date: doc.endDate,
                            tasks: doc.projectTasks,
                            team: doc.projectTeam,
                            _id: doc._id,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/user/dashboard/project/' + doc._id
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
    }

});

router.post('/', (req, res, next) => {
    var user = req.session.user;

    const project = new Project({
        _id: mongoose.Types.ObjectId(),
        ownerID: user._id,
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
    });

    project.save()
        .then(result => {
            res.send({
                express: 'Created Project',
                Project: {
                    name: result.name,
                    description: result.description,
                    startDate: result.startDate,
                    endDate: result.endDate,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/user/dashboard/project/' + result._id
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
});

router.get('/project/:Projectid', (req, res, next) => {
    var user;

    if (!req.session.user) {
        return res.status(401).json({
            message: "Please log in"
        });
    }
    else {
        user = req.session.user;

        const ProjectID = req.params.Projectid;
        Project.findById(ProjectID)
            .exec()
            .then(doc => {
                if (doc) {
                    res.send({ loggedIn: user, doc: doc });
                }
                else {
                    res.status(404).json({
                        message: "Project not found"
                    });
                }
            })
            .catch(err => {
                console.log(err)
                res.status(404).json({
                    error: err
                });
            });
    }
});

router.put('/project/:Projectid', (req, res, next) => {
    const ProjectID = req.params.Projectid;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Project.update({ _id: ProjectID }, { $set: updateOps })
        .exec()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/project/:Projectid', (req, res, next) => {
    const ProjectID = req.params.Projectid;
    Project.remove({ _id: ProjectID })
        .exec()
        .then(result => {
            res.send(result => {
                message: 'Project Deleted'
            });
        })
        .catch(err => {
            res.status(404).json({
                error: err
            });

        });
});

router.delete('/project/:Projectid/:UserID', (req, res, next) => {
    const ProjectID = req.params.Projectid;
    const UserID = req.params.UserID;

    Project.findById(ProjectID)
        .exec()
        .then(doc => {
            doc.projectTeam.forEach(member => {
                if (UserID == member._userID) {
                    Project.findByIdAndUpdate(ProjectID, {
                        $pull: {
                            projectTeam: { _id: member._id }
                        }
                    })
                        .exec()
                        .then(result => {
                            User.findById(UserID)
                                .exec()
                                .then(doc => {
                                    doc.projects.forEach(project => {
                                        if (ProjectID == project.projectID) {
                                            User.findByIdAndUpdate(UserID, {
                                                $pull: {
                                                    projects: { _id: project._id }
                                                }
                                            })
                                                .exec()
                                                .then(result => {
                                                    res.send(result => {
                                                        message: 'User Deleted'
                                                    });

                                                })
                                                .catch(err => {
                                                    res.status(404).json({
                                                        error: err
                                                    });

                                                })
                                        }
                                    })
                                })
                                .catch(err => {
                                    res.status(404).json({
                                        error: err
                                    });

                                });
                        })
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(404).json({
                error: err
            });
        });
});


module.exports = router;


