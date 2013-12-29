mongo-yac
========

Yet Another MongoDB Client for NodeJS

### Install:

    npm install mongo-yac
    
    
### Usage:
        Init:
                var db = require('mongo-yac');

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

                function(retval[, ptr]) = Function returns database value and ptr from request if it's set.
                
        Functions:
                db.open(callback);
                db.close();
                db.run(..);

                db.find(...);                   Alias to db.run({ action: 'find' });
                db.findOne(...);                Alias to db.run({ action: 'findOne' });
                db.save(...);                   Alias to db.run({ action: 'save' });
                db.insert(...);                 Alias to db.run({ action: 'insert' });
                db.remove(...);                 Alias to db.run({ action: 'remove' });
