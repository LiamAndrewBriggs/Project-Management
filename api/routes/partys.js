const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Party = require('../models/party');

router.get('/', (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({
            message: "Please log in"
        });  
    }

    Party.find()
        .select('name description date venue _id')
        .populate('venue', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                venues: docs.map(doc => {
                    return {
                        name: doc.name,
                        description: doc.description,
                        date: doc.date,
                        venue: doc.venue,
                        _id: doc._id,
                        request: {
                            type:'GET',
                            url: 'http://localhost:3000/partys/' + doc._id 
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
});

router.post('/', (req, res, next) => {
    const party = new Party({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        venue: req.body.venue,
    });
    party
        .save()
        .then(result => {
            res.send({ 
                express: 'Created Party',
                Party: {
                    name: result.name,
                    description: result.description,
                    date: result.date,
                    venue: result.venue,
                    _id: result._id,
                    request: {
                        type:'GET',
                        url: 'http://localhost:3000/partys/' + result._id 
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
    const partyID = req.params.partyid;
    Party.findById(partyID)
        .populate('venue', 'name location')
        .exec()
        .then(doc => {
            if(doc) {
                res.send(doc);
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
  

