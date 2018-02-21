const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    
    var user;

    if(!req.session.user) {
        user = "No User";
    }
    else {
        user = req.session.user;
       
        User.find()
        .select('name email _id')
        .exec()
        .then(docs => {
            const response = {
                loggedIn: user,
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        name: doc.name,
                        email: doc.email,
                        _id: doc._id
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

router.patch('/:userid', (req, res, next) => {
    const userID = req.params.userid;
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
        error: err
      });
    });
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