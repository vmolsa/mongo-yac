var mongoYac = require('./index.js');

var db = new mongoYac();
var db2 = new mongoYac();
var db3 = new mongoYac();

var timeOut1 = setTimeout(function() {
	db.close();
}, 2000);

var timeOut2 = setTimeout(function() {
	db2.close();
}, 2000);

var timeOut3 = setTimeout(function() {
	db3.close();
}, 2000);

db.config.default_function = function(ret) {
	console.log("DB1: Via Default Function:", ret);	
};

db.open(function() {

	db.insert({ collection: 'testCollection', query: { hello: 'World!' } }, function(ret) {

		if (ret) {

			console.log("DB1: OK");

		}

	});

	
	db.find({ collection: 'testCollection' });


	db.find({ collection: 'testCollection' }, function(ret) {

		if (ret) {

			console.log("DB1: OK");

			ret[0].ehlo = "Hello";



			db.save({ collection: 'testCollection', query: ret[0] }, function (ret) {

				if (ret) {

					console.log("DB1: OK");

					db.remove({ collection: "testCollection" }, function(ret) {

						if (ret) {

							console.log("DB1: OK");

							db.findOne({ collection: 'testCollection'}, function(ret) {

								if (ret == null) {
									console.log("DB1: OK");


									db.close(function() {
										console.log("DB1: Closed");
										clearTimeout(timeOut1);
									});

								}

							});

						}

					});

				}

			});

		}

	});

});

db.on('error', function(err) {
	console.log("DB1:", err);
	clearTimeout(timeOut1);
	db.close();
});


db2.config.database	= 'DatabaseName';

db2.config.username	= 'test';

db2.config.password	= 'quest';
db2.config.collection	= 'Pages';
db2.config.hostname 	= 'localhost';
db2.config.port		= '27017';

db2.open(function() {

	db2.insert({ query: { hello: 'World!' } }, function(ret) {

		if (ret) {

			console.log("DB2: OK", ret);

		}

	});


	db2.find(function(ret) {

		if (ret) {

			console.log("DB2: OK", ret);

			ret[0].ehlo = "Hello";



			db2.save({ query: ret[0] }, function (ret) {

				if (ret) {

					console.log("DB2: OK", ret);

					db2.remove(function(ret) {

						if (ret) {

							console.log("DB2: OK", ret);

							db2.findOne(function(ret) {

								if (ret == null) {
									console.log("DB2: OK");


									db2.close(function() {
										console.log("DB2: Closed");
										clearTimeout(timeOut2);
									});

								}

							});

						}

					});

				}

			});

		}

	});

});

db2.on('error', function(err) {
	console.log("DB2:", err);
	clearTimeout(timeOut2);
	db2.close();
});

db3.config.collection	= 'testCollection2';
db3.config.hostname 	= 'localhost';
db3.config.port		= '27017';

db3.open(function() {

	db3.run({ action: 'insert', query: { hello: 'World!' } }, function(ret) {

		if (ret) {

			console.log("DB3: OK");

		}

	});


	db3.find();


	db3.run({ action: 'find' }, function(ret) {

		if (ret) {

			console.log("DB3: OK");

			ret[0].ehlo = "Hello";



			db3.run({ action: 'save', query: ret[0] }, function (ret) {

				if (ret) {

					console.log("DB3: OK");


					db3.run({ action: 'remove' }, function(ret) {

						if (ret) {

							console.log("DB3: OK");

							db3.run({ action: 'findOne' }, function(ret) {

								if (ret == null) {
									console.log("DB3: OK");


									db3.close(function() {
										console.log("DB3: Closed");
										clearTimeout(timeOut3);
									});

								}

							});

						}

					});

				}

			});

		}

	});

});

db3.on('error', function(err) {
	console.log("DB3:", err);
	clearTimeout(timeOut3);
	db3.close();
});

console.log(db.config);
console.log(db2.config);
console.log(db3.config);
