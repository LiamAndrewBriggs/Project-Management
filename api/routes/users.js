const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

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
                            password: hash
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

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: "User Not Authorised"
                });  
            }
            bcrypt.compare(req.body.password, user[0].password, (err, response) => {
                if(err) {
                    return res.status(401).json({
                        message: "User Not Authorised"
                    });  
                }
                if (response) {
                    req.session.user = user[0];
                    return res.send({ 
                        message: 'User Authorisation Successful'
                    });
                }
                res.status(401).json({
                    message: "User Not Authorised"
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
    res.send({ 
        message: 'Session Ended'
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