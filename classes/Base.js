const Components = require('./Components');
const ColorPicker = require('../functions/ColorPicker');
const ArrayLibrary = require('./../functions/ArrayLibrary');
const ObjectsLibrary = require('./../functions/ObjectsLibrary');

class Empty {
}

class Base extends Components {
    constructor(theWindow = Empty) {
        super(theWindow);
        this.colorHandler = new ColorPicker();
        this.array =  new ArrayLibrary();
        this.object = new ObjectsLibrary();
    }
}

module.exports = Base;
