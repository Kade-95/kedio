class TreeEvent {
    name = '';
    attributes = {};

    constructor(name, attributes, bubble) {
        this.name = name;
        this.setAttributes = attributes;
        this.setBubble = bubble;
        
    }

    set setBubble(bubble){
        if(typeof bubble === 'boolean'){
            this.attributes.bubble = bubble;
        }
    }

    set setAttributes(attributes) {
        if (TreeEvent.events[this.name] == undefined) {
            TreeEvent.events[this.name] = attributes;
        }
        else {
            for (let i in TreeEvent.events[this.name]) {
                this.attributes[i] = TreeEvent.events[this.name][i];
            }
        }

        if (typeof attributes == 'object') {
            for (let i in attributes) {
                this.attributes[i] = attributes[i];
            }
        }
    }

    static events = {
        click: { name: 'Click', duration: '1sec', bubble: true },
        hover: { name: 'Hover', duration: 'Infinity', bubble: true },
        remove: { name: 'Remove', bubble: false },
        created: {name: 'Created', bubble: false, duration: '0sec'}
    };
}

module.exports = TreeEvent;