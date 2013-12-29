/*
	Copyright (c) 2013, Ville Mölsä
	All rights reserved.

	Yet Another MongoDB Client for NodeJS
*/

function mongoYac() {
	// Variables

	var MongoClient = require('mongodb').MongoClient;
	var ObjectID = require('mongodb').ObjectID;
	var Server = require('mongodb').Server;

	var connection = undefined;
	var database = undefined;
	var config = {
		database: 'test',
		username: '',
		password: '',
		hostname: '127.0.0.1',
		port: 27017,
	};

	// Functions

	function checkErrors(err) {
		if (err) {
			console.log("Database Error:", err.message);
			return false;
		}

		return true;
	}

	function callBack(err, retval, request, callback) {
		if (checkErrors(err) && callback) {
			try {
				if (request.ptr) {
					callback(retval, request.ptr);
				} else {
					callback(retval);
				}
			} catch (err) {
				checkErrors(err);
			}
		}
	}

	function collections(request, callback) {
		if (database) {
			database.collection(request.collection, function(err, collection) {
				if (checkErrors(err)) {
					switch (request.action) {
						case 'findOne':
							if (request.options) {
								collection.findOne(request.query, request.options, function(err, retval) { callBack(err, retval, request, callback); });
							} else {
								collection.findOne(request.query, function(err, retval) { callBack(err, retval, request, callback); });
							}

							break;
						case 'save':
							if (request.options) {
								collection.save(request.query, request.options, function(err, retval) { callBack(err, retval, request, callback); });
							} else {
								collection.save(request.query, function(err, retval) { callBack(err, retval, request, callback); });
							}

							break;
						case 'insert':
							if (request.options) {
								collection.insert(request.query, request.options, function(err, retval) { callBack(err, retval, request, callback); });
							} else {
								collection.insert(request.query, function(err, retval) { callBack(err, retval, request, callback); });
							}

							break;
						case 'remove':
							if (request.options) {
								collection.remove(request.query, request.options, function(err, retval) { callBack(err, retval, request, callback); });
							} else {
								collection.remove(request.query, function(err, retval) { callBack(err, retval, request, callback); });
							}

							break;
						default:
							if (request.options) {
								collection.find(request.query, request.options).toArray(function(err, retval) { callBack(err, retval, request, callback); });
							} else {
								collection.find(request.query).toArray(function(err, retval) { callBack(err, retval, request, callback); });
							}

							break;
					}
				}
			});
		} else {
			callBack({ message: "Not connected to database!" }, undefined, request, callback);
		}
	}

	function open(callback) {		
		var client = new MongoClient(new Server(config.hostname, config.port, {
				auto_reconnect: true,
		}));

		client.open(function(err, con) {
			if (checkErrors(err)) {
				connection = con;

				if (config.database) {
					database = connection.db(config.database);

					if (config.username && config.password) {
						database.authenticate(config.username, config.password, function(err) {
							if (checkErrors(err)) {
								callback();							
							} else {
								connection.close(checkErrors(err));
							}
						});
					} else {
						callback();
					}
				} else {
					callback();
				}
			}
		});
	}

	function close() {
		if (connection) {
			connection.close(function(err) {
				checkErrors(err);
			});
		}
	}

	function run(request, callback) {
		var query = {
			action: 	request.action 		? request.action 	: '',
			collection: 	request.collection 	? request.collection 	: '',
			query: 		request.query 		? request.query 	: '',
			ptr: 		request.ptr 		? request.ptr 		: undefined,
			options: 	request.options 	? request.options 	: undefined,
		};

		if (request.id && request.id.length == 12) {
			query.query._id = new ObjectID(request.id);
		} 

		if (callback == undefined) {
			callback = console.log;
		}

		collections(query, callback);
	}

	function find(request, callback) {
		request.action = 'find';

		run(request, callback);
	}

	function findOne(request, callback) {
		request.action = 'findOne';

		run(request, callback);
	}

	function save(request, callback) {
		request.action = 'save';

		run(request, callback);
	}

	function insert(request, callback) {
		request.action = 'insert';

		run(request, callback);
	}

	function remove(request, callback) {
		request.action = 'remove';

		run(request, callback);
	}

	// Define Object Functions

	this.open 	= open;
	this.close 	= close;
	this.run 	= run;
	this.find 	= find;
	this.findOne	= findOne;
	this.save	= save;
	this.insert	= insert;
	this.remove	= remove;
	this.config	= config;
}

// Exports

module.exports = new mongoYac();

