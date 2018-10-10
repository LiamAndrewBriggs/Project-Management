const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
var cors = require('cors');

const port = process.env.PORT || 5000;

const userProjectRoutes = require('./api/routes/userProjects');
const partyInviteRoutes= require('./api/routes/partyInvites');
const userRoutes = require('./api/routes/users');

mongoose.connect('mongodb://localhost:27017/ProjectManagment', { useNewUrlParser: true });
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

app.get('/', (req, res) => {
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
app.use('/user/dashboard', userProjectRoutes);
app.use('/user/partyinvites', partyInviteRoutes);
app.use('/user', userRoutes);


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