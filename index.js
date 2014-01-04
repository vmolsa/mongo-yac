/*
   Copyright (c) 2013, Ville Mölsä
   All rights reserved.

   Yet Another MongoDB Client for NodeJS. 
   Using "single" connection.
*/

var events = require('events');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var Server = require('mongodb').Server;

function mongoYac() {
   this.config = new Object({
      database: 'test',
      collection: 'test',
      username: '',
      password: '',
      hostname: '127.0.0.1',
      port: 27017,
      default_function: console.log,
      serverOptions: { auto_reconnect: true },
   });

   this.con = undefined;
   this.db = undefined;

   events.EventEmitter.call(this);
}

mongoYac.prototype.__proto__ = events.EventEmitter.prototype;

mongoYac.prototype.checkErrors = function(err) {
   if (err) {
      try {
         this.emit('error', 'Database Error: ' + err.message);
      } catch (ignored) {
         console.log('Database Error:', err.message);
      }

      return false;
   }

   return true;
}

mongoYac.prototype.callBack = function(err, retval, request, callback) {
   if (this.checkErrors(err) && callback) {
      try {
         if (request.ptr) {
            callback(retval, request.ptr);
         } else {
            callback(retval);
         }
      } catch (err) {
         this.checkErrors(err);
      }
   }
}

mongoYac.prototype.open = function(callback) {   
   var yac = this;

   var client = new MongoClient(new Server(yac.config.hostname, yac.config.port, yac.config.serverOptions));

   client.open(function(err, con) {
      if (yac.checkErrors(err)) {
         yac.con = con;

         if (yac.config.database) {
            yac.db = con.db(yac.config.database);

            if (yac.config.username && yac.config.password) {
               yac.db.authenticate(yac.config.username, yac.config.password, function(err) {
                  if (yac.checkErrors(err)) {
                     callback();               
                  } else {
                     yac.con.close();
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

mongoYac.prototype.close = function(callback) {
   var yac = this;   

   if (yac.con) {
      yac.con.close(function(err) {
         if (yac.checkErrors(err)) {
            if (callback) { callback(); }
         }
      });
   } 
}

mongoYac.prototype.run = function(request, callback) {
   var yac = this;
   var realcall = callback;
   var query = {
      action: '',
      collection: yac.config.collection,
      query: '',
      ptr: undefined,
      options: undefined,
   };

   if (typeof(request) == 'function') {
      realcall = request;
   } else {
      if (request != undefined || request != null) {
         query = {
            action	request.action		? request.action	: '',
            collection:	request.collection	? request.collection	: yac.config.collection,
            query:	request.query		? request.query		: '',
            ptr:	request.ptr		? request.ptr		: undefined,
            options:    request.options		? request.options	: undefined,
         };

         if (request.id && request.id.length == 12) {
            query.query._id = new ObjectID(request.id);
         }
      }
   }

   if (realcall == undefined || realcall == null) {
      realcall = yac.config.default_function;
   }

   if (yac.db) {
      yac.db.collection(query.collection, function(err, collection) {
         if (yac.checkErrors(err)) {
            try {
               switch (query.action) {
                  case 'findOne':
                     if (query.options) {
                        collection.findOne(query.query, query.options, function(err, retval) { yac.callBack(err, retval, query, realcall); });
                     } else {
                        collection.findOne(query.query, function(err, retval) { yac.callBack(err, retval, query, realcall); });
                     }

                     break;
                  case 'save':
                     if (query.options) {
                        collection.save(query.query, query.options, function(err, retval) { yac.callBack(err, retval, query, realcall); });
                     } else {
                        collection.save(query.query, function(err, retval) { yac.callBack(err, retval, query, realcall); });
                     }

                     break;
                  case 'insert':
                     if (query.options) {
                        collection.insert(query.query, query.options, function(err, retval) { yac.callBack(err, retval, query, realcall); });
                     } else {
                        collection.insert(query.query, function(err, retval) { yac.callBack(err, retval, query, realcall); });
                     }

                     break;
                  case 'remove':
                     if (query.options) {
                        collection.remove(query.query, query.options, function(err, retval) { yac.callBack(err, retval, query, realcall); });
                     } else {
                        collection.remove(query.query, function(err, retval) { yac.callBack(err, retval, query, realcall); });
                     }

                     break;
                  default:
                     if (query.options) {
                        collection.find(query.query, query.options).toArray(function(err, retval) { yac.callBack(err, retval, query, realcall); });
                     } else {
                        collection.find(query.query).toArray(function(err, retval) { yac.callBack(err, retval, query, realcall); });
                     }

                     break;
               }
            } catch   (err) {
               yac.callBack(err, undefined, query, realcall);
            }
         }
      });
   } else {
      yac.callBack({ message: "Not connected to database!" }, undefined, query, realcall);
   }
}

mongoYac.prototype.find = function(request, callback) {
   var yac = this;
   var realcall = callback;
   var query = {
      collection: yac.config.collection,
      query: '',
      ptr: undefined,
      options: undefined,
   };

   if (typeof(request) == 'function') {
      realcall = request;
   } else {
      if (request != undefined || request != null) {
         query = {
            collection:	request.collection	? request.collection	: yac.config.collection,
            query:	request.query		? request.query		: '',
            ptr:	request.ptr		? request.ptr		: undefined,
            options:    request.options		? request.options	: undefined,
         };

         if (request.id && request.id.length == 12) {
            query.query._id = new ObjectID(request.id);
         }
      }
   }

   if (realcall == undefined || realcall == null) {
      realcall = yac.config.default_function;
   }

   if (yac.db) {
      yac.db.collection(query.collection, function(err, collection) {
         if (yac.checkErrors(err)) {
            try {
               if (query.options) {
                  collection.find(query.query, query.options).toArray(function(err, retval) { yac.callBack(err, retval, query, realcall); });
               } else {
                  collection.find(query.query).toArray(function(err, retval) { yac.callBack(err, retval, query, realcall); });
               }
            } catch   (err) {
               yac.callBack(err, undefined, query, realcall);
            }
         }
      });
   } else {
      yac.callBack({ message: "Not connected to database!" }, undefined, query, realcall);
   }
}

mongoYac.prototype.findOne = function(request, callback) {
   var yac = this;
   var realcall = callback;
   var query = {
      collection: yac.config.collection,
      query: '',
      ptr: undefined,
      options: undefined,
   };

   if (typeof(request) == 'function') {
      realcall = request;
   } else {
      if (request != undefined || request != null) {
         query = {
            collection:	request.collection	? request.collection	: yac.config.collection,
            query:	request.query		? request.query		: '',
            ptr:	request.ptr		? request.ptr		: undefined,
            options:    request.options		? request.options	: undefined,
         };

         if (request.id && request.id.length == 12) {
            query.query._id = new ObjectID(request.id);
         }
      }
   }

   if (realcall == undefined || realcall == null) {
      realcall = yac.config.default_function;
   }

   if (yac.db) {
      yac.db.collection(query.collection, function(err, collection) {
         if (yac.checkErrors(err)) {
            try {
               if (query.options) {
                  collection.findOne(query.query, query.options, function(err, retval) { yac.callBack(err, retval, query, realcall); });
               } else {
                  collection.findOne(query.query, function(err, retval) { yac.callBack(err, retval, query, realcall); });
               }
            } catch   (err) {
               yac.callBack(err, undefined, query, realcall);
            }
         }
      });
   } else {
      yac.callBack({ message: "Not connected to database!" }, undefined, query, realcall);
   }
}

mongoYac.prototype.save = function(request, callback) {
   var yac = this;
   var realcall = callback;
   var query = {
      collection: yac.config.collection,
      query: '',
      ptr: undefined,
      options: undefined,
   };

   if (typeof(request) == 'function') {
      realcall = request;
   } else {
      if (request != undefined || request != null) {
         query = {
            collection:	request.collection	? request.collection	: yac.config.collection,
            query:	request.query		? request.query		: '',
            ptr:	request.ptr		? request.ptr		: undefined,
            options:    request.options		? request.options	: undefined,
         };

         if (request.id && request.id.length == 12) {
            query.query._id = new ObjectID(request.id);
         }
      }
   }

   if (realcall == undefined || realcall == null) {
      realcall = yac.config.default_function;
   }

   if (yac.db) {
      yac.db.collection(query.collection, function(err, collection) {
         if (yac.checkErrors(err)) {
            try {
               if (query.options) {
                  collection.save(query.query, query.options, function(err, retval) { yac.callBack(err, retval, query, realcall); });
               } else {
                  collection.save(query.query, function(err, retval) { yac.callBack(err, retval, query, realcall); });
               }
            } catch   (err) {
               yac.callBack(err, undefined, query, realcall);
            }
         }
      });
   } else {
      yac.callBack({ message: "Not connected to database!" }, undefined, query, realcall);
   }
}

mongoYac.prototype.insert = function(request, callback) {
   var yac = this;
   var realcall = callback;

   var query = {
      collection: yac.config.collection,
      query: '',
      ptr: undefined,
      options: undefined,
   };

   if (typeof(request) == 'function') {
      realcall = request;
   } else {
      if (request) {
         query = {
            collection:	request.collection	? request.collection	: yac.config.collection,
            query:	request.query		? request.query		: '',
            ptr:	request.ptr		? request.ptr		: undefined,
            options:    request.options		? request.options	: undefined,
         };

         if (request.id && request.id.length == 12) {
            query.query._id = new ObjectID(request.id);
         }
      }
   }

   if (realcall == undefined || realcall == null) {
      realcall = yac.config.default_function;
   }

   if (yac.db) {
      yac.db.collection(query.collection, function(err, collection) {
         if (yac.checkErrors(err)) {
            try {
               if (query.options) {
                  collection.insert(query.query, query.options, function(err, retval) { yac.callBack(err, retval, query, realcall); });
               } else {
                  collection.insert(query.query, function(err, retval) { yac.callBack(err, retval, query, realcall); });
               }
            } catch   (err) {
               yac.callBack(err, undefined, query, realcall);
            }
         }
      });
   } else {
      yac.callBack({ message: "Not connected to database!" }, undefined, query, realcall);
   }
}

mongoYac.prototype.remove = function(request, callback) {
   var yac = this;
   var realcall = callback;
   var query = {
      collection: yac.config.collection,
      query: '',
      ptr: undefined,
      options: undefined,
   };

   if (typeof(request) == 'function') {
      realcall = request;
   } else {
      if (request != undefined || request != null) {
         query = {
            collection:	request.collection	? request.collection	: yac.config.collection,
            query:	request.query		? request.query		: '',
            ptr:	request.ptr		? request.ptr		: undefined,
            options:    request.options		? request.options	: undefined,
         };

         if (request.id && request.id.length == 12) {
            query.query._id = new ObjectID(request.id);
         }
      }
   }

   if (realcall == undefined || realcall == null) {
      realcall = yac.config.default_function;
   }

   if (yac.db) {
      yac.db.collection(query.collection, function(err, collection) {
         if (yac.checkErrors(err)) {
            try {
               if (query.options) {
                  collection.remove(query.query, query.options, function(err, retval) { yac.callBack(err, retval, query, realcall); });
               } else {
                  collection.remove(query.query, function(err, retval) { yac.callBack(err, retval, query, realcall); });
               }
            } catch   (err) {
               yac.callBack(err, undefined, query, realcall);
            }
         }
      });
   } else {
      yac.callBack({ message: "Not connected to database!" }, undefined, query, realcall);
   }
}

// Exports

module.exports = mongoYac;
