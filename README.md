mongo-yac
========

Yet Another MongoDB Client for NodeJS.
Using "single" connection.

### Install:

    npm install mongo-yac
    
### Usage:

        var db = require('mongo-yac');

        db.config.database          = 'test';
        db.config.collection        = 'test';
        db.config.username          = '';
        db.config.password          = '';
        db.config.hostname          = '127.0.0.1';
        db.config.port              = 27017;
        db.config.default_function  = console.log;
        db.config.serverOptions     = { auto_reconnect: true }; # Look options from http://mongodb.github.io/node-mongodb-native/api-generated/server.html?highlight=server

        db.open(function() {
                db.run({...}, function() {
                    db.close();
                });
        });
            
        setTimeout(function() {
            db.close();
        }, 5000);
        
### Syntax:

        db.run({
                action: 'find' || 'findOne' || 'save' || 'insert' || 'remove',
                collection: 'NameOfCollection', || db.config.collection
                query: Object || '{ name: value }' || undefined,
                id: String.length == 12 || undefined,
                ptr: Object || Array || String || undefined, # Pointer to function
                options: {
                        "fields": ['fieldname1', 'fieldname2', 'fieldname3'],
                        "limit": 10,
                        "skip": 20,
                        "sort": ['fieldname2', ['fieldname1', desc], ['fieldname3', asc]],
                } # Look options from http://mongodb.github.io/node-mongodb-native/api-generated/collection.html

        }, function() || undefined); # default function is db.config.default_function (default: console.log)

        function(retval [,ptr]) = Function returns database value and ptr from request if it's set.
                
### Functions:

        db.open(callback);  # Creates new connection and opens database
        db.close();         # Close connections this is safe function! (can be called if it's not connected) 
        db.run(..);         

        db.find(...);       # Alias to db.run({ action: 'find' });      This method is Faster!
        db.findOne(...);    # Alias to db.run({ action: 'findOne' });   This method is Faster!
        db.save(...);       # Alias to db.run({ action: 'save' });      This method is Faster!
        db.insert(...);     # Alias to db.run({ action: 'insert' });    This method is Faster!
        db.remove(...);     # Alias to db.run({ action: 'remove' });    This method is Faster!
