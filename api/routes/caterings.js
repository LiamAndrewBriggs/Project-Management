const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Catering = require('../models/catering');

router.get('/', (req, res, next) => {
    var user;

    if(!req.session.user) {
        user = "No User";
    }
    else {
        user = req.session.user;
    }

    Catering.find()
    .select('name userName _id foodType image')
    .exec()
    .then(docs => {
        const response = {
            loggedIn: user,
            count: docs.length,
            caterings: docs.map(doc => {
                return {
                    name: doc.name,
                    image: doc.image,
                    foodType: doc.foodType,
                    _id: doc._id,
                    request: {
                        type:'GET',
                        url: 'http://localhost:3000/caterings/' + doc._id 
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
});

router.post('/', (req, res, next) => {
    const catering = new Catering({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        location: req.body.location,
        website: req.body.website,
        foodType: req.body.foodType
    });
    catering
    .save()
    .then(result => {
        res.send({ 
            express: 'Created Catering',
            Catering: {
                name: result.name,
                _id: result._id,
                request: {
                    type:'GET',
                    url: 'http://localhost:3000/caterings/' + result._id 
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

    const cateringID = req.params.id;
    Catering.findById(cateringID)
        .exec()
        .then(doc => {
            if(doc) {
                res.send({loggedIn: user, doc: doc});
            }
            else {
                res.status(404).json({
                    message: "Catering not found"
                });
            }
        })
        .catch(err => {
            res.status(404).json({
                error: err
            });
        });
});

router.patch('/:id', (req, res, next) => {
    const cateringID = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Catering.update({ _id: cateringID }, { $set: updateOps })
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

router.delete('/:id', (req, res, next) => {
    const cateringID = req.params.id;
    Catering.remove({ _id: cateringID })
        .exec()
        .then(result => {
            res.send(result => {
                message: 'Catering Deleted'
            });
        })
        .catch(err => {
            res.status(404).json({
                error: err
            });          
            
        });
});

module.exports = router;
  

