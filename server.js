const express = require('express');
const app = express();

const url = "mongodb://127.0.0.1:27017";
const port = process.env.PORT || 5000;

const userRoutes = require('./api/routes/users');
const partyRoutes = require('./api/routes/partys');

app.get('/home', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.use('/users', userRoutes);

app.use('/party', partyRoutes);

app.listen(port, () => console.log(`Listening on port ${port}`));