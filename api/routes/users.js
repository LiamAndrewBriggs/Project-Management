const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send({ express: 'User GET From Express' });
});

router.post('/', (req, res, next) => {
    res.send({ express: 'User POST From Express' });
});

router.get('/:id', (req, res, next) => {
    const userID = req.params.id;
    if(userID === 'special') {
      res.send({ express: 'You discovered the special id:' + userID });
    }
    else {
      res.send({ express: 'You passed an ID' });
    }
});

router.patch('/:id', (req, res, next) => {
    res.send({ express: 'Updated user'  });
});

router.delete('/:id', (req, res, next) => {
    res.send({ express: 'Deleted user'  });
});

module.exports = router;
  

