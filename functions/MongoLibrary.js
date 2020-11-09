const Func = require('./../classes/Func');
const ArrayLibrary = require('./ArrayLibrary');

const MongoClient = require('mongodb').MongoClient;

let func = new Func();
let arrayLib = new ArrayLibrary();

function MongoLibrary(details = { address: '', name: '', user: '', password: '', port: '', local: true }) {
    this.mongoCloud = 'mongodb+srv://';
    this.mongoLocal = 'mongodb://';
    this.user = details.user || '';
    this.password = details.password || '';
    this.address = details.address;
    this.name = details.name;
    this.options = details.options;
    this.port = details.port;
    this.local = details.local || false;

    this.getConnectionString = function () {
        let connectionString;
        if (this.local) {
            connectionString = `${this.mongoLocal}localhost:${this.port}/${this.name}`;
        }
        else {
            connectionString = `${this.mongoCloud}${this.user}:${this.password}@${this.address}/${this.name}`;
            if (func.isString(this.options)) {
                connectionString += `?${this.options}`;
            }
        }

        return encodeURI(connectionString);
    }

    this.connectionString = this.getConnectionString();

    this.setName = function (name) {
        this.name = name;
        this.connectionString = this.getConnectionString();
    }

    this.erase = function () {
        return this.open({}, db => {
            return db.db(this.name).dropDatabase();
        });
    }

    this.open = function (params = { url: '', options: { useNewUrlParser: true, useUnifiedTopology: true } }, callBack) {
        // open database for operations
        params.url = params.url || this.connectionString;
        params.options = params.options || { useNewUrlParser: true, useUnifiedTopology: true }
        if (func.isfunction(callBack)) {
            return new Promise((resolve, reject) => {
                MongoClient.connect(params.url, params.options, (err, db) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        callBack(db)
                            .then((result) => {
                                this.close(db);
                                if (func.isnull(db)) {
                                    reject(`Error => MongoDb is not running on this system. Database is null`);
                                }
                                else {
                                    resolve(result);
                                }
                            })
                            .catch(error => {
                                reject(error);
                            })
                    }
                });
            });
        }
        else {
            return new Promise((resolve, reject) => {
                MongoClient.connect(params.url, params.options, (err, db) => {
                    if (err) reject(err);
                    else resolve(db);
                });
            });
        }
    }

    this.close = function (db) {
        // close database 
        if (db) {
            db.close();
        }
    }

    this.insert = function (params = { collection: '', query: {}, getInserted: false }) {
        // insert into database        
        let database = null;
        let value;
        return new Promise((resolve, reject) => {
            if (!func.isString(params.collection)) {
                reject('Invalid collection name');
            }
            if (!func.isObject(params.query)) {
                reject('Invalid query');
            }
            this.open()
                .then((db) => {
                    database = db;
                    return db.db(this.name).collection(params.collection);
                })
                .then((collection) => {
                    if (Array.isArray(params.query)) value = collection.insertMany(params.query);
                    else value = collection.insertOne(params.query);
                    return value;
                })
                .then((result) => {
                    if (params.getInserted == true) {
                        resolve(result.ops);
                    }
                    else resolve(result.result.ok);
                    database.close();
                })
                .catch((err) => {
                    database.close();
                    reject(err);
                });
        });
    }

    this.update = function (params = { collection: '', query: {}, options: {}, many: false }) {
        // update database
        let database = null;
        return new Promise((resolve, reject) => {
            if (!func.isObject(params)) {
                reject('Invalid parameter');
            }
            if (!func.isString(params.collection)) {
                reject('Invalid collection name');
            }
            if (!func.isObject(params.query)) {
                reject('Invalid query');
            }
            if (!func.isObject(params.options)) {
                reject('Invalid options');
            }

            this.open()
                .then((db) => {
                    database = db;
                    return db.db(this.name).collection(params.collection);
                })
                .then((collection) => {
                    if (params.many == true) return collection.updateMany(params.query, params.options);
                    else return collection.updateOne(params.query, params.options);
                })
                .then((result) => {
                    resolve(result.result.ok);
                    database.close();
                })
                .catch((err) => {
                    database.close();
                    reject(err);
                });
        });
    }

    this.save = function (params = { collection: '', query: {}, check: {}, options: {}, many: false }) {
        // save or replace the content of a document
        return this.exists({ collection: params.collection, query: params.check })
            .then(result => {
                if (result) {
                    return this.update({ collection: params.collection, query: params.check, options: { '$set': params.query } })
                }
                else {
                    return this.insert(params);
                }
            })
            .then(result => {
                return result;
            });
    }

    this.replace = function (params = { collection: '', query: {}, new: {} }) {
        // insert or update the content of document
        let database = null;
        return new Promise((resolve, reject) => {
            if (!func.isObject(params)) {
                reject('Invalid parameter');
            }
            if (!func.isString(params.collection)) {
                reject('Invalid collection name');
            }
            if (!func.isObject(params.query)) {
                reject('Invalid query');
            }
            if (!func.isObject(params.new)) {
                reject('Invalid new value');
            }
            this.open().then((db) => {
                database = db;
                return db.db(this.name).collection(params.collection);
            }).then((collection) => {
                return collection.replaceOne(params.query, params.new);
            }).then((result) => {
                resolve(result.result.ok);
                database.close();
            }).catch((err) => {
                database.close();
                reject(err);
            });
        });
    }

    this.aggregate = function (params = { collection: '', query: {} }) {
        // perform an aggregation on database
        let database = null;
        return new Promise((resolve, reject) => {
            if (!func.isObject(params)) {
                reject('Invalid parameter');
            }
            if (!func.isString(params.collection)) {
                reject('Invalid collection name');
            }
            if (!func.isObject(params.query)) {
                reject('Invalid query');
            }
            this.open().then((db) => {
                database = db;
                return db.db(this.name).collection(params.collection);
            }).then((collection) => {
                return collection.aggregate(params.query).toArray();
            }).then((result) => {
                resolve(result);
                database.close();
            }).catch((err) => {
                database.close();
                reject(err);
            });
        });
    }

    this.join = function (params = { collection: '', query: { lookup: { from: '', localField: '', foreignField: '', as: '' } } }) {
        // join documents 
        let database = null;
        return new Promise((resolve, reject) => {
            if (!func.isObject(params)) {
                reject('Invalid parameter');
            }
            if (!func.isString(params.collection)) {
                reject('Invalid collection name');
            }
            if (!func.isObject(params.query)) {
                reject('Invalid collection name');
            }
            if (!func.isObject(params.query.lookup)) {
                reject('Invalid lookup');
            }
            if (!func.isString(params.query.lookup.from)) {
                reject('Invalid lookup source');
            }
            if (!func.isString(params.query.lookup.localField)) {
                reject('Invalid lookup localfield');
            }
            if (!func.isString(params.query.lookup.foreignField)) {
                reject('Invalid lookup foreignfield');
            }
            if (!func.isString(params.query.lookup.as)) {
                reject('Invalid lookup as');
            }

            this.open()
                .then((db) => {
                    database = db;
                    return db.db(this.name).collection(params.collection);
                })
                .then((collection) => {
                    let components = [],
                        single = {};
                    for (let i in params.query) {
                        single = {};
                        single[`$${i}`] = params.query[i];
                        components.push(single);
                    }

                    return collection.aggregate(components).toArray();
                })
                .then((result) => {
                    resolve(result);
                    database.close();
                })
                .catch((err) => {
                    database.close();
                    reject(err);
                });
        });
    }

    this.exists = function (params = { collection: '', query: {} }) {
        // check if document exists
        return new Promise((resolve, reject) => {
            this.find(params).then((res) => {
                if (!func.isnull(res)) resolve(true)
                else resolve(false)
            }).catch(err => {
                reject(err);
            });
        });
    }

    this.ifNotExist = function (params = { collection: '', query: {}, check: [{}], action: '' }) {
        let found = false;
        return new Promise(async (resolve, reject) => {
            for (let q of params.check) {
                found = await this.exists({ collection: params.collection, query: q });
                if (found) {
                    resolve({ found: Object.keys(q) });
                    break;
                }
            }

            if (!found) {
                this[params.action](params).then(worked => {
                    resolve(worked);
                }).catch(error => {
                    reject(error)
                });
            }
        });
    }

    this.ifIExist = function (params = { collection: '', query: {}, check: [{}], action: '' }) {
        let exists = false;
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < params.check.length; i++) {//loop through the check queries
                let query = params.check[i].query;
                let allFound = await this.find({ collection: params.collection, query, many: true });//find them all
                if (allFound.length) {//if found
                    for (let found of allFound) {//loop through all the found items
                        for (let [key, value] of Object.entries(params.check[i].against)) {
                            if (found[key] != value) {//check it is the same
                                resolve({ found: Object.keys(query) });
                                exists = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (!exists) {
                this[params.action](params).then(worked => {
                    resolve(worked);
                }).catch(error => {
                    reject(error)
                });
            }
        });
    }

    this.find = function (params = { collection: '', query: {}, many: false, options: { projection: {} } }) {
        // find in database
        let database = null;
        let value;
        return new Promise((resolve, reject) => {
            if (!func.isString(params.collection)) {
                reject('Invalid collection name');
            }
            if (!func.isObject(params.query)) {
                reject('Invalid query');
            }
            params.projection = params.projection || {};
            params.options = params.options || {};
            let options = { projection: params.projection };

            for (let option in params.options) {
                options[option] = params.options[option];
            }

            if (!params.collection.includes('#')) {
                this.open()
                    .then((db) => {
                        database = db;
                        return db.db(this.name).collection(params.collection);
                    })
                    .then((collection) => {
                        if (func.isset(params.many)) {
                            value = collection.find(params.query, options);

                            if (func.isset(params.many.limit)) value = value.limit(params.many.limit);

                            if (func.isset(params.many.sort)) value = value.sort(params.many.sort);

                            value = value.toArray();
                        } else {
                            value = collection.findOne(params.query, options);
                        }
                        return value;
                    })
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((err) => {
                        reject(err);
                    })
                    .finally(() => {
                        database.close();
                    });
            }
            else {
                let [collection, name] = params.collection.split('#');
                this.open()
                    .then((db) => {
                        database = db;
                        return db.db(this.name).collection(collection);
                    })
                    .then((collection) => {
                        value = collection.findOne({ name });
                        return value;
                    })
                    .then(found => {
                        if (func.isnull(found)) {
                            return found;
                        }
                        else {
                            if (func.isObject(params.query)) {
                                if (func.isset(params.many) && params.many == true) {
                                    found = func.array.findAll(found.contents, item => {
                                        let flag = true;
                                        for (let n in params.query) {
                                            if (item[n] != params.query[n]) flag = false;
                                            continue;
                                        }
                                        return flag;
                                    });
                                }
                                else {
                                    found = arrayLib().find(found.contents, item => {
                                        let flag = true;
                                        for (let n in params.query) {
                                            if (item[n] != params.query[n]) flag = false;
                                            continue;
                                        }
                                        return flag;
                                    });
                                }
                            }

                            if (func.isObject(params.projection)) {
                                if (Array.isArray(found)) {
                                    for (let item of found) {
                                        for (let p in item) {
                                            if (p == '_id') {
                                                if (params.projection[p] == 0) {
                                                    delete item[p];
                                                }
                                            }
                                            else if (!Object.keys(params.projection).includes(p) || params.projection[p] == 0) {
                                                delete item[p];
                                            }
                                        }
                                    }
                                }
                                else if (typeof found == 'object') {
                                    for (let p in found) {
                                        if (p == '_id') {
                                            if (params.projection[p] == 0) {
                                                delete found[p];
                                            }
                                        }
                                        else if (!Object.keys(params.projection).includes(p) || params.projection[p] == 0) {
                                            delete found[p];
                                        }
                                    }
                                }
                            }
                        }
                        return found;
                    })
                    .then((result) => {
                        resolve(result);
                        database.close();
                    })
                    .catch((err) => {
                        database.close();
                        reject(err);
                    });
            }
        });
    }

    this.delete = function (params = { collection: '', query: {}, many: false }) {
        // delete from database
        let database = null;

        return new Promise((resolve, reject) => {
            if (!func.isString(params.collection)) {
                reject('Invalid collection name');
            }
            if (!func.isObject(params.query)) {
                reject('Invalid query');
            }

            this.open()
                .then((db) => {
                    database = db;
                    return db.db(this.name).collection(params.collection);
                })
                .then((collection) => {
                    if (params.many == true) return collection.deleteMany(params.query);
                    else return collection.deleteOne(params.query);
                })
                .then((result) => {
                    resolve(result);
                    database.close();
                })
                .catch((e) => {
                    database.close();
                    reject(e);
                });
        });
    }

    this.recycle = function (params = { collection: '', query: {}, many: false }) {
        //get the data to delete and insert it into recycle bin before deleting it
        return new Promise((resolve, reject) => {
            this.find(params).then(result => {
                let toInsert = { collection: 'recycle', query: { _id: result._id, collection: params.collection, query: result } };
                this.insert(toInsert).then(result => {
                    this.delete(params).then(result => {
                        resolve(result);
                    }).catch(err => {
                        resolve('Error Inserting data to recycle => ' + err);
                    });
                }).catch(err => {
                    resolve('Error Inserting data to recycle => ' + err);
                });
            }).catch(err => {
                resolve('Error Fetching data to recycle => ' + err);
            });
        });
    }

    this.restore = function (params = { id: '' }) {
        //get the data from recycle bin restore it to collection then clear it from recycle bin
        return new Promise((resolve, reject) => {
            this.find({ collection: 'recycle', query: { _id: new ObjectId(params.id) }, projection: { _id: 0 } }).then(result => {
                this.insert(result).then(result => {
                    this.delete({ collection: 'recycle', query: { _id: new ObjectId(params.id) } }).then(result => {
                        resolve(result);
                    }).catch(err => {
                        reject('Error clearing data from recylce bin=> ' + err);
                    });
                }).catch(err => {
                    reject('Error restoring data from recylce bin=> ' + err);
                });
            }).catch(err => {
                reject('Error fetching data from recylce bin=> ' + err);
            });
        });
    }

    this.dropCollection = function (collection) {
        // delete database
        return this.open({}, db => {
            return db.db(this.name).dropCollection(collection)
                .then(result => {
                    return result == true;
                })
                .catch(err => {
                    return false;
                });
        });
    }

    this.createCollection = function (collection) {
        // create database
        this.open({}, db => {
            return db.db(this.name).createCollection(collection);
        });
    }

    this.getCollections = function () {
        return new Promise((resolve, reject) => {
            this.open()
                .then(db => {
                    return db.db().listCollections().toArray();
                })
                .then(collections => {
                    resolve(collections);
                });
        });
    }

    this.modify = function (params = { collection: '', query: {}, update: {} }) {
        // update database
        let database = null;
        return new Promise((resolve, reject) => {
            if (!func.isObject(params)) {
                reject('Invalid parameter');
            }
            if (!func.isString(params.collection)) {
                reject('Invalid collection name');
            }
            if (!func.isObject(params.query)) {
                reject('Invalid query');
            }
            if (!func.isObject(params.update)) {
                reject('Invalid update');
            }

            let projection = { _id: 0 }, update = {};
            for (let name in params.update) {
                projection[name] = 1;
            };
            this.find({ collection: params.collection, query: params.query, projection })
                .then(data => {
                    for (let name in data) {
                        if (params.update[name].action.toLowerCase() == 'set') {
                            update[name] = params.update[name].value;
                        }
                        else if (params.update[name].action.toLowerCase() == 'increase') {
                            let n = new Number(params.update[name].value);
                            let c = new Number(data[name]);

                            if (isNaN(n) || isNaN(c)) {
                                update[name] = data[name] + params.update[name].value;
                            }
                            else {
                                update[name] = c + n;
                            }
                        }
                        else if (params.update[name].action.toLowerCase() == 'decrease') {
                            let n = new Number(params.update[name].value);
                            let c = new Number(data[name]);

                            if (isNaN(n) || isNaN(c)) {
                                update[name] = data[name] - params.update[name].value;
                            }
                            else {
                                update[name] = c - n;
                            }
                        }
                    }

                    this.update({ collection: params.collection, query: params.query, options: { '$set': update } }).then(result => {
                        resolve(data);
                    })
                })
        });
    }

    this.work = function (params = { collection: '' }) {
        return new Promise((resulve, reject) => {
            this.open().then(db => {
                return db.db(this.name).collection(params.collection);
            }).then(collection => {
                params.callBack(collection);
            });
        });
    }

    this.say = function () {
        console.log(this.name);
    }
}

module.exports = MongoLibrary;