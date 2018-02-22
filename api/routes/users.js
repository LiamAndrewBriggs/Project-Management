const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    
    if (!req.session.user) {
        return res.status(401).json({
            message: "Please log in"
        });  
    }
    else if (req.session.user.userLevel === 1)
    {
        User.find()
        .select('name email')
        .exec()
        .then(docs => {
            const response = {
                loggedIn: req.session.user,
                count: docs.length,
                user: docs.map(doc => {
                    return {
                        name: doc.name,
                        email: doc.email,
                        _id: doc._id,
                        request: {
                            type:'GET',
                            url: 'http://localhost:3000/user/' + doc._id 
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
    else if (req.session.user.userLevel === 2)
    {
        User.find()
        .select('name email invitedTo')
        .exec()
        .then(docs => {
            const response = {
                loggedIn: req.session.user,
                count: docs.length,
                user: docs.map(doc => {
                    return {
                        name: doc.name,
                        email: doc.email,
                        invitedTo: doc.invitedTo,
                        _id: doc._id,
                        request: {
                            type:'GET',
                            url: 'http://localhost:3000/user/' + doc._id 
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

router.get('/login', (req, res, next) => {
    res.send({ express: 'Log In Form' });
});

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });  
            }
            bcrypt.compare(req.body.password, user[0].password, (err, response) => {
                if(err) {
                    return res.status(401).json({
                        message: "Invalid email or password"
                    });
                }
                if (response) {
                    req.session.user = user[0];
                    return res.send({ 
                        message: 'User Authorisation Successful'
                    });
                }
                res.status(401).json({
                    message: "Invalid email or password"
                }); 
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            }); 
        });
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect("/home");
});

router.get('/signup', (req, res, next) => {
    res.send({ express: 'Log In Form' });
});

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user =>{
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Email exists'
                });
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            userLevel: req.body.userLevel
                        });
                        user
                            .save()
                            .then(result => {
                                res.send({ 
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            });
                    }
                });
            }
        })
});

router.get('/:userid', (req, res, next) => {
    var user;
    const userID = req.params.userid;

    if(!req.session.user) {
        user = "No User";
    }
    else {
        user = req.session.user;
    }

    if(user._id === userID || user.userLevel === 1)
    {
        User.findById(userID)
        .exec()
        .then(doc => {
            if(doc) {
                res.send({loggedIn: user, doc: doc});
            }
            else {
                res.status(404).json({
                    message: "User not found"
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

router.patch('/:userid', (req, res, next) => {
    const userID = req.params.userid;
    
    if(!req.session.user) {
        user = "No User";
    }
    else {
        user = req.session.user;
    }

    if(req.body.length !== 1)
    {
        if(user._id === userID || user.userLevel === 1)
        {
            const userEmail = user.email
            
            User.find({email: req.body[1].value})
                .exec()
                .then(user =>{
                    if (user.length >= 1 && userEmail !== req.body[1].value) {
                        return res.status(409).json({
                            message: 'Email exists'
                        });
                    }

                    var edit = req.body;
                                                
                    if(req.body[2].value) {
                        bcrypt.hash(req.body[2].value, 10, (err, hash) => {
                            if (err) {
                                return res.status(500).json({
                                    error: err,
                                    message: "hash"
                                });
                            }
                            else {
                                edit[2] = { "propName": 'password', "value": hash };

                                const updateOps = {};
                                for (const ops of edit) {
                                    updateOps[ops.propName] = ops.value;
                                }
                                User.update({ _id: userID }, { $set: updateOps })
                                    .exec()
                                    .then(result => {
                                        res.send(result);
                                    })
                                    .catch(err => {
                                        res.status(500).json({
                                        error: err,
                                        update: "hash2"
                                        });
                                });
                            }
                        });
                    }

                    const updateOps = {};
                    for (const ops of req.body) {
                        updateOps[ops.propName] = ops.value;
                    }
                    User.update({ _id: userID }, { $set: updateOps })
                        .exec()
                        .then(result => {
                            res.send(result);
                        })
                        .catch(err => {
                            res.status(500).json({
                            error: err,
                            update: "hash2"
                            });
                        });
                })
                .catch(err => {
                    res.status(404).json({
                        error: err
                    });          
                    
                });
        }  
    }
    else {
        const updateOps = {};
        for (const ops of req.body) {
            updateOps[ops.propName] = ops.value;
        }
        User.update({ _id: userID }, { $set: updateOps })
            .exec()
            .then(result => {
                res.send(result);
            })
            .catch(err => {
                res.status(500).json({
                error: err,
                update: "hash2"
            });
        });
    }
});

router.delete('/:userId', (req, res, next) => {
    const userID = req.params.userId;
    User.remove({_id: userID})
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
            
        });
});


module.exports = router;