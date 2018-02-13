const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const port = process.env.PORT || 5000;

const venueRoutes = require('./api/routes/venues');
const partyRoutes = require('./api/routes/partys');

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

mongoose.connect('mongodb://LiamTwiggy:University13@project-management-shard-00-00-oeb62.mongodb.net:27017,project-management-shard-00-01-oeb62.mongodb.net:27017,project-management-shard-00-02-oeb62.mongodb.net:27017/test?ssl=true&replicaSet=project-management-shard-0&authSource=admin');
mongoose.Promise = global.Promise;



app.get('/home', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

//Routes to handle requests
app.use('/venues', venueRoutes);
app.use('/party', partyRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);  
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));