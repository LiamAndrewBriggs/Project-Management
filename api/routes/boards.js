const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Party = require('../models/project');
const User = require('../models/user');

router.get('/:board', (req, res) => {

    console.log(req.params.board);
    console.log(req.query);

    var userID = req.session.user._id;

    if (!req.session.user) {
        return res.status(401).json({
            message: "Please log in"
        });
    }
    else {
        var query = JSON.stringify(req.query);
        const response = {
            loggedIn: req.session.user
        };
        res.send(response);
    }
});

module.exports = router;


