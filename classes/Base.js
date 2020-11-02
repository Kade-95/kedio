const Components = require('./Components');
const ColorPicker = require('../functions/ColorPicker');
const ArrayLibrary = require('./../functions/ArrayLibrary');
const ObjectsLibrary = require('./../functions/ObjectsLibrary');
const Icons = require('./../Icons');

class Empty {
}

class Base extends Components {
    constructor(theWindow = Empty) {
        super(theWindow);
        this.colorHandler = new ColorPicker();
        this.array = ArrayLibrary();
        this.object = ObjectsLibrary();
        this.icons = Icons;
    }
}

module.exports = Base;
