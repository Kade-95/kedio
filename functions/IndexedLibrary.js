const ObjectsLibrary = require('./ObjectsLibrary');
let objectLibrary = new ObjectsLibrary();

function IndexedLibrary(name, version) {
    this.name = name;
    this.version = version;
    this.initialized = false;
    this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    this.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    this.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    this.init = function (callback) {//initialize db by setting the current version
        const request = this.indexedDB.open(this.name);
        request.onupgradeneeded = (event) => {
            if (typeof callback == 'function') {
                (callback(event.target.result));
            }
        }

        request.onsuccess = (event) => {
            this.version = Math.floor(request.result.version) || Math.floor(this.version);
            this.initialized = true;
        }

        request.onerror = (event) => {
            console.log(event.target.error);
        }
    }

    this.getVersion = function () {
        return new Promise((resolve, reject) => {
            const request = this.indexedDB.open(this.name);
            request.onsuccess = (event) => {
                if (this.version == undefined || this.version < request.result.version) {
                    this.version = request.result.version;
                }
                request.result.close();
                resolve(this.version);
            }

            request.onerror = (event) => {
                reject(event.target.error);
            }
        })
    }

    this.open = async function (callback) {
        if (this.version == undefined) {
            await this.getVersion();//set the version if not set
        }
        return new Promise((resolve, reject) => {
            const request = this.indexedDB.open(this.name, this.version);//open db
            request.onupgradeneeded = (event) => {
                this.version = request.result.version;//update version after upgrade

                if (typeof callback == 'function') {//run the callback if set
                    let workedDb = callback(event.target.result);
                    workedDb.onerror = workedEvent => {
                        reject(workedEvent.target.error);
                    }
                }
            }

            request.onsuccess = (event) => {
                resolve(event.target.result);
            }

            request.onerror = (event) => {
                reject(event.target.error);
            }
        });
    }

    this.collectionExists = function (collection) {
        return this.open().then(db => {
            let exists = db.objectStoreNames.contains(collection);//check if db has this collection in objectstore
            return exists;
        });
    }

    this.createCollection = async function (...collections) {
        let version = await this.getVersion();//upgrade collection
        this.version = version + 1;
        return this.open(db => {
            for (let collection of collections) {
                if (!db.objectStoreNames.contains(collection)) {//create new collection and set _id as the keypath
                    db.createObjectStore(collection, { keyPath: '_id' });
                }
            }
            return db;
        });
    }

    this.find = function (params) {
        return new Promise((resolve, reject) => {
            this.open().then(db => {
                let documents = [];

                if (db.objectStoreNames.contains(params.collection)) {//collection exists
                    let transaction = db.transaction(params.collection, 'readonly');

                    transaction.onerror = event => {
                        db.close();
                        reject(event.target.error);
                    }

                    transaction.oncomplete = event => {
                        if (params.many == true) {//many 
                            db.close();
                            resolve(documents);
                        }
                        else {
                            db.close();
                            resolve(documents[0]);//single
                        }
                    }

                    let store = transaction.objectStore(params.collection);
                    let request = store.openCursor();
                    let cursor;

                    request.onerror = (event) => {
                        db.close();
                        reject(event.target.error);
                    }

                    request.onsuccess = (event) => {
                        cursor = event.target.result;
                        if (cursor) {
                            if (params.query == undefined) {//find any
                                documents.push(cursor.value);
                            }
                            else if (objectLibrary.isSubObject(cursor.value, params.query)) {//find specific
                                documents.push(cursor.value);
                            }
                            cursor.continue();
                        }
                    };
                }
                else {
                    if (params.many == true) {//many 
                        db.close();
                        resolve(documents);
                    }
                    else {
                        db.close();
                        resolve(documents[0]);//single
                    }
                }
            }).catch(error => {
                db.close();
                reject(error);
            });
        });
    }

    this.emptyCollection = function (collection) {
        let removedCount = 0, foundCount = 0;//set the counters
        return new Promise((resolve, reject) => {
            this.find({ collection, query: {}, many: true }).then(found => {//find all documents
                this.open().then(db => {
                    if (db.objectStoreNames.contains(collection)) {//handle collection non-existence error
                        let transaction = db.transaction(collection, 'readwrite');
                        let store = transaction.objectStore(collection);

                        transaction.onerror = event => {
                            db.close();
                            reject(event.target.error);
                        }

                        transaction.oncomplete = event => {
                            db.close();
                            resolve({ action: 'emptycollection', removedCount, ok: removedCount == foundCount });
                        }
                        foundCount = found.length;
                        for (let data of found) {
                            let request = store.delete(data._id);//delete each document
                            request.onerror = event => {
                                console.log(`Error while deleting documents => ${event.target.error}`);
                            }

                            request.onsuccess = event => {
                                removedCount++;
                            }
                        }
                    }
                    else {
                        db.close();
                        resolve({ removedCount, ok: removedCount == foundCount });
                    }
                }).catch(error => {
                    db.close();
                    reject(error);
                });
            }).catch(error => {
                db.close();
                reject(error);
            })
        });
    }

    this.documentExists = function (params) {
        delete params.many;//check for only one
        return this.find(params).then(res => {//
            return res != undefined;
        });
    }

    this.generateId = function () {
        let id = Date.now().toString(36) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);//generate the id using time
        return id;
    }

    this.checkId = function (request, _id, callback) {
        if (typeof _id != 'string') {
            _id = this.generateId();//get new _id if not set
        }
        let get = request.get(_id);//check if existing
        get.onsuccess = event => {
            if (event.target.result != undefined) {
                this.checkId(request, _id, callback);
            }
            else {
                callback(_id);//use the _id
            }
        }

        get.onerror = event => {
            console.log(`Error checking ID => ${event.target.error}`);
        }
    }

    this.add = function (params, db) {
        return new Promise((resolve, reject) => {
            let transaction = db.transaction(params.collection, 'readwrite');
            transaction.onerror = (event) => {
                db.close();
                reject(event.target.error)
            };

            transaction.oncomplete = (event) => {
                db.close();
                resolve({ action: 'insert', documents: params.query });
            }

            let request = transaction.objectStore(params.collection);

            if (params.many == true && Array.isArray(params.query)) {// for many
                for (let query of params.query) {
                    this.checkId(request, query._id, _id => {//validate _id
                        query._id = _id;
                        request.add(query);//add
                    });
                }
            }
            else {
                this.checkId(request, params.query._id, _id => {//validate _id
                    params.query._id = _id;
                    request.add(params.query);//add
                });
            }
        });
    }

    this.insert = async function (params) {
        let isCollection = await this.collectionExists(params.collection);
        if (isCollection) {//collection is existing
            return this.open()
                .then(db => {
                    return this.add(params, db);//add to collection
                })
                .catch(error => {
                    return error;
                });
        }
        else {
            return this.createCollection(params.collection)//create collection
                .then(db => {
                    return this.add(params, db);//add to new Collection
                })
                .catch(error => {
                    return error;
                });
        }
    }

    this.update = function (params) {
        return new Promise((resolve, reject) => {
            this.open().then(db => {
                if (!db.objectStoreNames.contains(params.collection)) {
                    db.close();
                    reject('Collection not found');
                }

                let transaction = db.transaction(params.collection, 'readwrite');

                transaction.onerror = event => {
                    db.close();
                    reject(event.target.error);
                }

                transaction.oncomplete = event => {
                    db.close();
                    resolve({ action: 'update', documents });
                }

                let store = transaction.objectStore(params.collection);
                let request = store.openCursor();
                let documents = {};

                request.onerror = (event) => {
                    db.close();
                    reject(event.target.error);
                }

                request.onsuccess = (event) => {
                    let cursor = event.target.result;
                    let found = false;
                    if (cursor) {
                        if (objectLibrary.isSubObject(cursor.value, params.check)) {//retrieve the matched documents
                            found = true;
                            for (let i in params.query) {
                                cursor.value[i] = params.query[i];
                            }

                            try {
                                let res = cursor.update(cursor.value);//update

                                res.onerror = (rEvent) => {
                                    documents[rEvent.target.result] = { value: cursor.value, status: false };
                                }

                                res.onsuccess = (rEvent) => {
                                    documents[rEvent.target.result] = { value: cursor.value, status: true };
                                }
                            } catch (error) {
                                db.close();
                                reject(error);
                            }
                        }

                        if (params.many == true || found == false) {
                            cursor.continue();
                        }
                    }
                };
            }).catch(error => {
                db.close();
                reject(error);
            });
        });
    }

    this.save = function (params = { collection: '', query: {}, check: {} }) {
        //check existence of document
        return this.documentExists({ collection: params.collection, query: params.check }).then(exists => {
            if (exists == false) {
                return this.insert(params);//insert if not found
            }
            else {
                return this.update(params);// update if found
            }
        });
    }

    this.delete = function (params) {
        let foundCount = 0, removedCount = 0;//set the counters
        return new Promise((resolve, reject) => {
            this.find(params).then(found => {
                this.open().then(db => {
                    let transaction = db.transaction(params.collection, 'readwrite');
                    let store = transaction.objectStore(params.collection);

                    transaction.onerror = event => {
                        db.close();
                        reject(event.target.error);
                    }

                    transaction.oncomplete = event => {
                        db.close();
                        resolve({ action: 'delete', removedCount, ok: removedCount == foundCount });
                    }

                    if (Array.isArray(found)) {//if many
                        foundCount = found.length;
                        for (let data of found) {
                            let request = store.delete(data._id);//delete each
                            request.onerror = event => {
                                console.log(`Error while deleting documents => ${event.target.error}`);
                            }

                            request.onsuccess = event => {
                                removedCount++;
                            }
                        }
                    }
                    else if (found) {
                        foundCount = 1;
                        let request = store.delete(found._id);//delete document
                        request.onerror = event => {
                            console.log(`Error while deleting documents => ${event.target.error}`);
                        }

                        request.onsuccess = event => {
                            removedCount++;
                        }
                    }
                }).catch(error => {
                    db.close();
                    reject(error);
                });
            }).catch(error => {
                db.close();
                reject(error);
            });
        });
    }
}

module.exports = IndexedLibrary;
