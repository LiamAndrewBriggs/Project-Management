const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Venue = require('../models/venue');

router.get('/', (req, res, next) => {
    var user;

    if(!req.session.user) {
        user = "No User";
    }
    else {
        user = req.session.user;
    }

    Venue.find()
    .select('name userName _id capactity image')
    .exec()
    .then(docs => {
        const response = {
            loggedIn: user,
            count: docs.length,
            venues: docs.map(doc => {
                return {
                    name: doc.name,
                    image: doc.image,
                    capactity: doc.capactity,
                    _id: doc._id,
                    request: {
                        type:'GET',
                        url: 'http://localhost:3000/venues/' + doc._id 
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
    const venue = new Venue({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        type: req.body.type,
        price: req.body.price,
        image: req.body.image,
        capactity: req.body.capactity,
        location: req.body.location,
        website: req.body.website,
        description: req.body.description
    });
    venue
    .save()
    .then(result => {
        res.send({ 
            express: 'Created Venue',
            Venue: {
                name: result.name,
                _id: result._id,
                request: {
                    type:'GET',
                    url: 'http://localhost:3000/venues/' + result._id 
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

router.get('/:id', (req, res, next) => {
    const venueID = req.params.id;
    Venue.findById(venueID)
        .exec()
        .then(doc => {
            if(doc) {
                res.send(doc);
            }
            else {
                res.status(404).json({
                    message: "Venue not found"
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

router.patch('/:id', (req, res, next) => {
    const venueID = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Venue.update({ _id: venueID }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:id', (req, res, next) => {
    const venueID = req.params.id;
    Venue.remove({ _id: venueID })
        .exec()
        .then(result => {
            res.send(result => {
                message: 'Venue Deleted'
            });
        })
        .catch(err => {
            res.status(404).json({
                error: err
            });          
            
        });
});

module.exports = router;
  

