var express = require('express'),
	app = express(),
	mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/adaptation');

app.use(express.bodyParser());
app.use(express.static('./app'));

// Bootstrap models
require('./models/DocStructure');
require('./models/Document');
require('./models/Profil');
require('./models/Tag');
require('./models/ProfilTag');


//Bootstrap routes
require('./routes/adaptation')(app);


app.listen(3000);
console.log('Express server started on port 3000');

module.exports = app;