const ObjectsLibrary = require('./ObjectsLibrary');
let objectLibrary = ObjectsLibrary();

function IndexedLibrary(name, version) {
    let self = { name, version, initialized: false };
    self.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    self.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    self.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    self.init = function (callback) {//initialize db by setting the current version
        const request = self.indexedDB.open(self.name);
        request.onupgradeneeded = (event) => {
            if (typeof callback == 'function') {
                (callback(event.target.result));
            }
        }

        request.onsuccess = (event) => {
            self.version = Math.floor(request.result.version) || Math.floor(self.version);
            self.initialized = true;
        }

        request.onerror = (event) => {
            console.log(event.target.error);
        }
    }

    self.getVersion = function () {
        return new Promise((resolve, reject) => {
            const request = self.indexedDB.open(self.name);
            request.onsuccess = (event) => {
                if (self.version == undefined || self.version < request.result.version) {
                    self.version = request.result.version;
                }
                request.result.close();
                resolve(self.version);
            }

            request.onerror = (event) => {
                reject(event.target.error);
            }
        })
    }

    self.open = async function (callback) {
        if (self.version == undefined) {
            await self.getVersion();//set the version if not set
        }
        return new Promise((resolve, reject) => {
            const request = self.indexedDB.open(self.name, self.version);//open db
            request.onupgradeneeded = (event) => {
                self.version = request.result.version;//update version after upgrade

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

    self.collectionExists = function (collection) {
        return self.open().then(db => {
            let exists = db.objectStoreNames.contains(collection);//check if db has this collection in objectstore
            db.close();
            return exists;
        });
    }

    self.createCollection = async function (...collections) {
        let version = await self.getVersion();//upgrade collection
        self.version = version + 1;
        return self.open(db => {
            for (let collection of collections) {
                if (!db.objectStoreNames.contains(collection)) {//create new collection and set _id as the keypath
                    db.createObjectStore(collection, { keyPath: '_id' });
                }
            }
            db.close();
            return db;
        });
    }

    self.find = function (params) {
        return new Promise((resolve, reject) => {
            self.open().then(db => {
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

    self.emptyCollection = function (collection) {
        let removedCount = 0, foundCount = 0;//set the counters
        return new Promise((resolve, reject) => {
            self.find({ collection, query: {}, many: true }).then(found => {//find all documents
                self.open().then(db => {
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

    self.documentExists = function (params) {
        delete params.many;//check for only one
        return self.find(params).then(res => {//
            return res != undefined;
        });
    }

    self.generateId = function () {
        let id = Date.now().toString(36) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);//generate the id using time
        return id;
    }

    self.checkId = function (request, _id, callback) {
        if (typeof _id != 'string') {
            _id = self.generateId();//get new _id if not set
        }
        let get = request.get(_id);//check if existing
        get.onsuccess = event => {
            if (event.target.result != undefined) {
                self.checkId(request, _id, callback);
            }
            else {
                callback(_id);//use the _id
            }
        }

        get.onerror = event => {
            console.log(`Error checking ID => ${event.target.error}`);
        }
    }

    self.add = function (params, db) {
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
                    self.checkId(request, query._id, _id => {//validate _id
                        query._id = _id;
                        request.add(query);//add
                    });
                }
            }
            else {
                self.checkId(request, params.query._id, _id => {//validate _id
                    params.query._id = _id;
                    request.add(params.query);//add
                });
            }
        });
    }

    self.insert = async function (params) {
        let isCollection = await self.collectionExists(params.collection);
        if (isCollection) {//collection is existing
            return self.open()
                .then(db => {
                    return self.add(params, db);//add to collection
                })
                .catch(error => {
                    return error;
                });
        }
        else {
            return self.createCollection(params.collection)//create collection
                .then(db => {
                    return self.add(params, db);//add to new Collection
                })
                .catch(error => {
                    return error;
                });
        }
    }

    self.update = function (params) {
        return new Promise((resolve, reject) => {
            self.open().then(db => {
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

    self.save = function (params = { collection: '', query: {}, check: {} }) {
        //check existence of document
        return self.documentExists({ collection: params.collection, query: params.check }).then(exists => {
            if (exists == false) {
                return self.insert(params);//insert if not found
            }
            else {
                return self.update(params);// update if found
            }
        });
    }

    self.delete = function (params) {
        let foundCount = 0, removedCount = 0;//set the counters
        return new Promise((resolve, reject) => {
            self.find(params).then(found => {
                self.open().then(db => {
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

    return self;
}

module.exports = IndexedLibrary;
