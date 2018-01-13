const express = require('express');
const bodyParser = require('body-parser');

// set up express app
const app = express();

// use body-parser middleware
// app.use(bodyParser.json());

//Enable Cross Origin Resource Sharing.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// initialize routes
app.use('/', require('./routes/api'));

// listen for requests
app.listen(process.env.port || 4000, function(){
    console.log('now listening for requests');
});