'use strict';

var mongoose = require('mongoose');

process.env.NODE_ENV = 'test';

/* avant le debut de tous les tests */
before(function(done) {
	function clearDB() {
		/* pour corriger une erreur signalé par JSHint : Don't make functions within a loop */
		function callBack() {}
		for (var i in mongoose.connection.collections) {
			mongoose.connection.collections[i].remove(callBack);
		}
		return done();
	}

	if (mongoose.connection.readyState === 0) {
		mongoose.connect('mongodb://localhost/adaptation-test', function(err) {
			if (err) {
				throw err;
			}
			return clearDB();
		});
	} else {
		return clearDB();
	}
});

/* apres la fin de tous les tests */
after(function(done) {
	mongoose.disconnect();
	return done();
});