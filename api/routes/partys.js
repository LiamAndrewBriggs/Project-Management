const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send({ express: 'Partys were fetched' });
});

router.post('/', (req, res, next) => {
    res.send({ express: 'Party was created' });
});

router.get('/:partyid', (req, res, next) => {
    const userID = req.params.partyid;
    res.send({ express: 'You changed party:' + userID });
    
});

router.delete('/:partyid', (req, res, next) => {
    res.send({ express: 'Party deleted'  });
});

module.exports = router;
  

