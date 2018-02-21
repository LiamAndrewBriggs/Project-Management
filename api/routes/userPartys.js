const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Party = require('../models/party');
const User = require('../models/user');

router.get('/', (req, res, next) => {
    
    if (!req.session.user) {
        return res.status(401).json({
            message: "Please log in"
        });  
    }
    else {
        console.log(req.session.user);
        User.findById(req.session.user._id)
        .select('partys')
        .exec()
        .then(docs => {
             Party.find({
                    '_id': { $in: docs.partys }
                })
                .select('name description startDate venue _id')
                .populate('venue', 'name')
                .exec()
                .then(docss => {
                    const response = {
                        loggedIn: req.session.user,
                        count: docss.length,
                        partys: docss.map(doc => {
                            return {
                                name: doc.name,
                                description: doc.description,
                                date: doc.startDate,
                                _id: doc._id,
                                request: {
                                    type:'GET',
                                    url: 'http://localhost:3000/user/partys/' + doc._id 
                                }
                            }
                        })
                    };
                    console.log(response);
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

router.post('/', (req, res, next) => {
    const party = new Party({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    });
    party
        .save()
        .then(result => {
            res.send({ 
                express: 'Created Party',
                Party: {
                    name: result.name,
                    description: result.description,
                    startDate: result.startDate,
                    endDate: result.endDate,
                    _id: result._id,
                    request: {
                        type:'GET',
                        url: 'http://localhost:3000/user/partys/' + result._id 
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

router.get('/:partyid', (req, res, next) => {
    var user;

    if(!req.session.user) {
        user = "No User";
    }
    else {
        user = req.session.user;
    }
    
    const partyID = req.params.partyid;
    Party.findById(partyID)
        .exec()
        .then(doc => {
            if(doc) {
                res.send({loggedIn: user, doc: doc});
            }
            else {
                res.status(404).json({
                    message: "Party not found"
                });
            }
        })
        .catch(err => {
            console.log(err)
            res.status(404).json({
                error: err
            });
        });
});

router.patch('/:partyid', (req, res, next) => {
    const partyID = req.params.partyid;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Party.update({ _id: partyID }, { $set: updateOps })
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

router.delete('/:partyid', (req, res, next) => {
    const partyID = req.params.partyid;
    Party.remove({ _id: partyID })
        .exec()
        .then(result => {
            res.send(result => {
                message: 'Party Deleted'
            });
        })
        .catch(err => {
            res.status(404).json({
                error: err
            });          
            
        });
});

module.exports = router;
  

