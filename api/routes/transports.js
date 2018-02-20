const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Transport = require('../models/transport');

router.get('/', (req, res, next) => {
    var user;

    if(!req.session.user) {
        user = "No User";
    }
    else {
        user = req.session.user;
    }

    Transport.find()
    .select('name userName _id maxcarsize image')
    .exec()
    .then(docs => {
        const response = {
            loggedIn: user,
            count: docs.length,
            transports: docs.map(doc => {
                return {
                    name: doc.name,
                    image: doc.image,
                    maxcarsize: doc.maxcarsize,
                    _id: doc._id,
                    request: {
                        type:'GET',
                        url: 'http://localhost:3000/transports/' + doc._id 
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
    const transport = new Transport({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        location: req.body.location,
        website: req.body.website,
        maxcarsize: req.body.maxcarsize,
        mincarsize: req.body.maxcarsize,
    });
    transport
    .save()
    .then(result => {
        res.send({ 
            express: 'Created Transport',
            Catering: {
                name: result.name,
                _id: result._id,
                request: {
                    type:'GET',
                    url: 'http://localhost:3000/transports/' + result._id 
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
    var user;

    if(!req.session.user) {
        user = "No User";
    }
    else {
        user = req.session.user;
    }

    const transportID = req.params.id;
    Transport.findById(transportID)
        .exec()
        .then(doc => {
            if(doc) {
                res.send({loggedIn: user, doc: doc});
            }
            else {
                res.status(404).json({
                    message: "Transport not found"
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
    const transportID = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Transport.update({ _id: transportID }, { $set: updateOps })
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
    const transportID = req.params.id;
    Transport.remove({ _id: transportID })
        .exec()
        .then(result => {
            res.send(result => {
                message: 'Transport Deleted'
            });
        })
        .catch(err => {
            res.status(404).json({
                error: err
            });          
            
        });
});

module.exports = router;
  

