const ArrayLibrary = require('./ArrayLibrary');
let arrayLibrary = new ArrayLibrary();

function ObjectsLibrary() {

    this.extractFromJsonArray = (meta, source) => {//extract a blueprint of data from a JsonArray
        let keys = Object.keys(meta);//get the keys
        let values = Object.values(meta);//get the values

        let eSource = [];
        if (source != undefined) {
            for (let obj of source) {//each item in source
                let object = {};
                for (let i in keys) {//each blueprint key
                    if (arrayLibrary.contains(Object.keys(obj), values[i])) {//source item has blueprint value
                        object[keys[i]] = obj[values[i]];//store according to blueprint
                    }
                }
                eSource.push(object);
            }
        }
        return eSource;
    }

    this.find = (obj, callback) => {//higher order Object function for the first item in an Object that match
        for (let i in obj) {
            if (callback(obj[i]) == true) {
                return obj[i];
            }
        }
    }

    this.findAll = (obj, callback) => {//higher order Object function for all items in an Object that match
        let values = {};
        for (let i in obj) {
            if (callback(obj[i]) == true)
                values[i] = obj[i];
        }

        return values;
    }

    this.makeIterable = (obj) => {//make an object to use 'for in'
        obj[Symbol.iterator] = function* () {
            let properties = Object.keys(obj);
            for (let p of properties) {
                yield this[p];
            }
        }
        return obj;
    }

    this.max = (object) => {
        object = this.sort(object, { value: true });
        return this.getIndex(object);
    }

    this.min = (object) => {//get the mininum in item in an Object
        object = this.sort(object, { value: false });
        return this.getIndex(object);
    }

    this.onChanged = (obj, callback) => {//make an object listen to changes of it's items
        const handler = {
            get(target, property, receiver) {//when an Item is fetched
                try {
                    return new Proxy(target[property], handler);
                } catch (err) {
                    return Reflect.get(target, property, receiver);
                }
            },
            defineProperty(target, property, descriptor) {//when an Item is added
                callback(target, property);
                return Reflect.defineProperty(target, property, descriptor);
            },
            deleteProperty(target, property) {//when an Item is removed
                callback(target, property);
                return Reflect.deleteProperty(target, property);
            }
        };

        return new Proxy(obj, handler);
    }

    this.toArray = (object, named) => {//turn an Object into an Array
        var array = [];
        Object.keys(object).map((key) => {
            if (named == true) {//make it named
                array[key] = object[key];
            }
            else {
                array.push(object[key]);
            }
        });
        return array;
    }

    this.valueOfObjectArray = (array, name) => {//get all the keys in a JsonArray of item name
        var newArray = [];
        for (let i in array) {
            newArray.push(array[i][name]);
        }
        return newArray;
    }

    this.keysOfObjectArray = (array = []) => {//get all the keys in a JsonArray
        var newArray = [];
        for (let i in array) {
            newArray = newArray.concat(Object.keys(array[i]));
        }
        return arrayLibrary.toSet(newArray);//remove duplicates
    }

    this.objectOfObjectArray = (array = [], id, name) => {//strip [key value] from a JsonArray
        var object = {};
        for (let i in array) {
            object[array[i][id]] = array[i][name];
        }
        return object;
    }

    this.copy = (from, to) => {//clone an Object
        Object.keys(from).map(key => {
            to[key] = from[key];
        });
    }

    this.forEach = (object, callback) => {//higher order function for Object literal
        for (let key in object) {
            callback(object[key], key);
        }
    }

    this.each = function (object, callback) {//higher order function for Object literal
        let newObject = {};
        for (let key in object) {
            newObject[key] = callback(object[key], key);
        }
        return newObject;
    }

    this.isSubObject = (data, sample) => {//check if an object is a sub-Object of another Object
        let flag;
        for (let name in sample) {
            flag = JSON.stringify(sample[name]) == JSON.stringify(data[name]);//convert to string and compare
            if (!flag) break;
        }

        return flag;
    }

    this.getSubObject = (data = [], sample = {}) => {//get matched items in Object
        let matched = [], flag = true;
        for (let i in data) {
            flag = this.isSubObject(data[i], sample);//check each object
            if (!flag) continue;
            matched.push(data[i]);
        }

        return matched
    }

    this.sort = (data = {}, params = { items: [], descend: false, key: false, value: false }) => {//sort an Object based on[key, value or items]
        params.item = params.item || '';
        params.descend = params.descend || false;

        let sorted = [], nData = {};
        for (let [key, value] of Object.entries(data)) {
            sorted.push({ key, value });
        }

        if (params.key != undefined) {//sort with key
            console.log('Hello');
            sorted.sort((a, b) => {
                let value = (a.key >= b.key);
                if (params.key == true) value = !value;//descend
                return value;
            });
        }

        if (params.value != undefined) {//sort with value
            sorted.sort((a, b) => {
                let value = (a.value >= b.value);
                if (params.value == true) value = !value;//descend
                return value;
            });
        }

        if (params.items != undefined) {//sort with items
            sorted.sort((a, b) => {
                let greater = 0, lesser = 0;
                for (let item of params.items) {
                    if (a.value[item] >= b.value[item]) greater++
                    else lesser++;
                }
                let value = greater >= lesser;
                if (params.descend == true) value = !value;//descend items
                return value;
            });
        }

        for (let { key, value } of sorted) {
            nData[key] = value;
        }

        return nData;
    }

    this.reverse = (data = {}) => {//reverse an Object
        let keys = Object.keys(data).reverse();
        let newObject = {};
        for (let i of keys) {
            newObject[i] = data[i];
        }
        return newObject;
    }

    this.getIndex = (data = {}) => {//get the first item in the Object
        let key = Object.keys(data).shift();
        let value = data[key];
        return { key, value };
    }

    this.getLast = (data = {}) => {//get the last item in the Object
        let key = Object.keys(data).pop();
        let value = data[key];
        return { key, value };
    }

    this.getAt = (data = {}, index) => {//get the item of index in the Object
        let key = Object.keys(data)[index];
        let value = data[key];
        return { key, value };
    }

    this.keyOf = (data = {}, item) => {//get the first occurrance of an item in an Object
        let index = -1;
        for (let i in data) {
            if (JSON.stringify(data[i]) == JSON.stringify(item)) {
                return i;
            }
        }

        return index;
    }

    this.lastKeyOf = (data = {}, item) => {//get the last occurrance of an item in an object
        let index = -1;
        for (let i in data) {
            if (JSON.stringify(data[i]) == JSON.stringify(item)) {
                index = i;
            }
        }

        return index;
    }

    this.includes = (data = {}, item) => {//check if an Object has an item
        return this.keyOf(data, item) != -1;
    }

    this.aggregate = (data = {}, groups = {}) => {
        let funcs = {
            $sum: (...a) => { return a.reduce((i, j) => i + j) },
            $dif: (...a) => { return a[0] - a[1] ? a[1] : 0 },
            $mul: (...a) => { return a.reduce((i, j) => i * j) },
            $dif: (...a) => { return a[0] - a[1] ? a[1] : 1 },
            cast: (a, to) => {
                if (to == 'int') a = parseInt(a);
                else if (to == 'float') a = parseFloat(a);
                else if (to == 'string') a = a.toString();
                else if (to == 'date') a = new Date(a);
                return a;
            },
        }

        let agg = Object.assign({}, data);
        let x, list, l;
        for (x in groups) {
            list = [];
            for (l of groups[x].list) list.push(agg[l]);
            agg[x] = funcs[groups[x].action](...list);
        }

        return agg;
    }
}

module.exports = ObjectsLibrary;