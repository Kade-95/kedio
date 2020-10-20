const Components = require('./Components');
const ColorPicker = require('./ColorPicker');
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
                'https://kade-95.github.io/kerdx/css/table.css',
                'https://kade-95.github.io/kerdx/css/cell.css',
                'https://kade-95.github.io/kerdx/css/form.css',
                'https://kade-95.github.io/kerdx/css/picker.css',
                'https://kade-95.github.io/kerdx/css/select.css',
                'https://kade-95.github.io/kerdx/css/json.css',
                'https://kade-95.github.io/kerdx/css/popup.css'
            ];
            for (let style of this.styles) {
                this.loadCss(style);
            }
        }
    }
}

module.exports = Base;
