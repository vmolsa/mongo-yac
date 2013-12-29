var db = require('mongo-yac');

db.config.database         = 'test';
db.config.username         = '';
db.config.password         = '';
db.config.hostname         = '127.0.0.1';
db.config.port             = 27017;

db.open(function() {
	db.insert({ collection: 'devices', query: { hello: 'World!' } }, function(ret) {
		if (ret) {
			console.log("OK");
		}
	});

	db.find({ collection: 'devices' }, function(ret) {
		if (ret) {
			console.log("OK");
			ret[0].ehlo = "Hello";

			db.save({ collection: 'devices', query: ret[0] }, function (ret) {
				if (ret) {
					console.log("OK");
					db.remove({ collection: "devices" }, function(ret) {
						if (ret) {
							console.log("OK");
							db.findOne({ collection: 'devices'}, function(ret) {
								if (ret == null) {
									console.log("OK");
									db.close();
								}
							});
						}
					});
				}
			});
		}
	});
});
