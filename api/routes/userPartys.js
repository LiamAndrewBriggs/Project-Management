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
    else if (req.session.user.userLevel === 1)
    {
        Party.find()
        .select('name description startDate venue _id')
        .exec()
        .then(docs => {
            const response = {
                loggedIn: req.session.user,
                count: docs.length,
                partys: docs.map(doc => {
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
            res.send(response);
        })
        .catch(err => {
                res.status(500).json({
                    error: err
                })
            });
    }
    else {
        User.findById(req.session.user._id)
        .select('partys')
        .exec()
        .then(docs => {
             Party.find({
                    '_id': { $in: docs.partys }
                })
                .select('name description startDate venue _id')
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
                    res.send(response);
                })
                .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            });
        }
});

router.post('/', (req, res, next) => {
    var user = req.session.user;

    const party = new Party({
        _id: mongoose.Types.ObjectId(),
        ownerID: user._id,
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        venue: req.body.venue,
        catering: req.body.catering,
        entertainment: req.body.entertainment,
        transport: req.body.transport
    });

    party.save()
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
  

