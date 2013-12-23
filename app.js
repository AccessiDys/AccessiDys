var express = require('express'),
	app = express(),
	mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/scrum');

app.use(express.bodyParser());
app.use(express.static('./app'));

// Bootstrap models
require('./models/scrum');

//Bootstrap routes
require('./routes/adaptation')(app);


app.listen(3000);
console.log('Express server started on port 3000');

module.exports = app;