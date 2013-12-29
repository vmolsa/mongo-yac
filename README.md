mongo-yac
========

Yet Another MongoDB Client for NodeJS

        Init:
                var db = require('mongoYac');

                db.config.database         = 'test';
                db.config.username         = '';
                db.config.password         = '';
                db.config.hostname         = '127.0.0.1';
                db.config.port                 = 27017;

                db.open(function() {
                        db.run(...);
                });

        Syntax:

                db.run({
                        action:        'find' || 'findOne' || 'save' || 'insert' || 'remove',

                        collection: 'NameOfCollection',

                        query: Object || '{ name: value }' || undefined,

                        id: String.length == 12 || undefined,

                        ptr: Object || Array || String || undefined,

                        options: {
                                "fields": ['fieldname1', 'fieldname2', 'fieldname3'],
                                "limit": 10,
                                "skip": 20,
                                "sort": ['fieldname2', ['fieldname1', desc], ['fieldname3', asc]],
                        }

                }, function() || undefined); // default function is console.log

                function(retval[, ptr])        = Function returns database value and ptr from request if it's set.


        Functions:
                db.open(callback);
                db.close();
                db.run(..);

                db.find(...);                   Alias to db.run({ action: 'find' });
                db.findOne(...);                Alias to db.run({ action: 'findOne' });
                db.save(...);                   Alias to db.run({ action: 'save' });
                db.insert(...);                 Alias to db.run({ action: 'insert' });
                db.remove(...);                 Alias to db.run({ action: 'remove' });

        Example:

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
        
