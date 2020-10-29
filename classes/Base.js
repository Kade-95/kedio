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

        if (this.Element) {
            this.styles = [
                'https://kade-95.github.io/kedio/css/table.css',
                'https://kade-95.github.io/kedio/css/cell.css',
                'https://kade-95.github.io/kedio/css/form.css',
                'https://kade-95.github.io/kedio/css/picker.css',
                'https://kade-95.github.io/kedio/css/select.css',
                'https://kade-95.github.io/kedio/css/json.css',
                'https://kade-95.github.io/kedio/css/popup.css'
            ];
            for (let style of this.styles) {
                this.loadCss(style);
            }
        }
    }
}

module.exports = Base;
