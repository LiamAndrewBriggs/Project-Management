const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Entertainment = require('../models/entertainment');

router.get('/', (req, res, next) => {
    var user;

    if(!req.session.user) {
        user = "No User";
    }
    else {
        user = req.session.user;
    }

    Entertainment.find()
    .select('name userName _id genre image')
    .exec()
    .then(docs => {
        const response = {
            loggedIn: user,
            count: docs.length,
            entertainment: docs.map(doc => {
                return {
                    name: doc.name,
                    image: doc.image,
                    genre: doc.genre,
                    _id: doc._id,
                    request: {
                        type:'GET',
                        url: 'http://localhost:3000/entertainments/' + doc._id 
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
    const entertainment = new Entertainment({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        location: req.body.location,
        website: req.body.website,
        genre: req.body.genre
    });
    entertainment
    .save()
    .then(result => {
        res.send({ 
            express: 'Created Entertainment',
            Catering: {
                name: result.name,
                _id: result._id,
                request: {
                    type:'GET',
                    url: 'http://localhost:3000/entertainments/' + result._id 
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

    const entertainmentID = req.params.id;
    Entertainment.findById(entertainmentID)
        .exec()
        .then(doc => {
            if(doc) {
                res.send({loggedIn: user, doc: doc});
            }
            else {
                res.status(404).json({
                    message: "Entertainment not found"
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
    const entertainmentID = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Entertainment.update({ _id: entertainmentID }, { $set: updateOps })
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
    const entertainmentID = req.params.id;
    Entertainment.remove({ _id: entertainmentID })
        .exec()
        .then(result => {
            res.send(result => {
                message: 'Entertainment Deleted'
            });
        })
        .catch(err => {
            res.status(404).json({
                error: err
            });          
            
        });
});

module.exports = router;
  

