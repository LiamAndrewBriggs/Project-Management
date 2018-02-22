const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
var cors = require('cors');

const port = process.env.PORT || 5000;

const venueRoutes = require('./api/routes/venues');
const userPartyRoutes = require('./api/routes/userPartys');
const partyInviteRoutes= require('./api/routes/partyInvites');
const userRoutes = require('./api/routes/users');
const cateringRoutes = require('./api/routes/caterings');
const entertainmentRoutes = require('./api/routes/entertainments');
const transportRoutes = require('./api/routes/transports');

mongoose.connect('mongodb://LiamTwiggy:University13@project-management-shard-00-00-oeb62.mongodb.net:27017,project-management-shard-00-01-oeb62.mongodb.net:27017,project-management-shard-00-02-oeb62.mongodb.net:27017/test?ssl=true&replicaSet=project-management-shard-0&authSource=admin');
mongoose.Promise = global.Promise;

app.use(cors({credentials: true, origin: true}));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(session({
  secret: 'bufekbuf123thv',
  resave: true,
  saveUninitialized: true, 
  cookie: {
    secure: false,
    httpOnly: false
  }
}));

app.get('/home', (req, res) => {
  if(!req.session.user) {
    user = "No User";
  }
  else {
      user = req.session.user;
  }

  res.send({
        loggedIn: user,
        express: 'Welcome Home' 
  });
});

//Routes to handle requests
app.use('/venues', venueRoutes);
app.use('/user/partys', userPartyRoutes);
app.use('/user/partyinvites', partyInviteRoutes);
app.use('/user', userRoutes);
app.use('/caterings', cateringRoutes);
app.use('/entertainments', entertainmentRoutes);
app.use('/transports', transportRoutes);


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

const server = app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = server;