const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Party = require('../models/project');
const User = require('../models/user');

router.get('/', (req, res, next) => {
    var userID = req.session.user._id;
    
    if (!req.session.user) {
        return res.status(401).json({
            message: "Please log in"
        });  
    }
    else {
        User.findById(userID)
        .select('invitedTo')
        .exec()
        .then(docs => {

                const response = {
                loggedIn: req.session.user,
                invitedTo: docs.invitedTo
            }



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

module.exports = router;
  

