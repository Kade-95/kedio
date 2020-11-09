const Func = require('./../classes/Func');
let func = new Func();

function Shadow(element) {
    this.element = element.cloneNode(true);
    this.properties = {};
    this.childProperties = {};

    this.updateNewElementChildProperties = function (element, propertyCollection = {}) {
        let children, positions;
        for (let identifier in propertyCollection) {
            for (let childProperties of propertyCollection[identifier]) {
                positions = this.setPositions(childProperties.positions);
                children = this.getChildren(identifier, element, positions);
                for (let j = 0; j < children.length; j++) {
                    children[j].setProperties(childProperties.properties);
                }
            }
        }
    }

    this.updateNewElementChildAttributes = function (element, attributeCollection = {}) {
        let children, positions;
        for (let identifier in attributeCollection) {
            for (let childAtrributes of attributeCollection[identifier]) {
                positions = this.setPositions(childAtrributes.positions);
                children = this.getChildren(identifier, element, positions);
                for (let j = 0; j < children.length; j++) {
                    children[j].setAttributes(childAtrributes.attributes);
                }
            }
        }
    }

    this.setPositions = function (positions = 1) {
        if (!Array.isArray(positions)) {
            positions = func.range(positions);
        }

        return positions;
    }

    this.createElement = function (params = { childDetails: { attributes: {}, properties: {} }, details: { attributes: {}, properties: {} } }) {
        let element = this.element.cloneNode(true);
        this.children.push(element);

        this.prepareElement(element, params);
        return element;
    }

    this.prepareElement = function (element, params = { childDetails: { attributes: {}, properties: {} }, details: { attributes: {}, properties: {} } }) {
        if (params.childDetails != undefined) {
            if (params.childDetails.attributes != undefined) {
                this.updateNewElementChildAttributes(element, params.childDetails.attributes);
            }

            if (params.childDetails.properties != undefined) {
                this.updateNewElementChildProperties(element, params.childDetails.properties);
            }
        }

        if (params.details != undefined) {
            if (params.details.attributes != undefined) {
                element.setAttributes(params.details.attributes);
            }

            if (params.details.properties != undefined) {
                element.setProperties(params.details.properties);
            }
        }

        this.updateNewElementChildProperties(element, this.childProperties);
        element.setProperties(this.properties);

        this.makeCloneable(element);
    }

    this.removeElement = function (element) {
        let children = [];
        let position = this.children.indexOf(element);
        for (let i = 0; i < this.children.lengt; i++) {
            if (position != i) {
                children.push(this.children[i]);
            }
        }
        this.children = children;
    }

    this.cloneElement = function (position, params = { childDetails: { attributes: {}, properties: {} }, details: { attributes: {}, properties: {} } }) {
        let element = this.children[position].cloneNode(true);
        this.children.push(element);

        this.prepareElement(element, params);
        return element;
    }

    this.makeCloneable = function (element) {
        let position = this.children.indexOf(element);
        if (position == -1) {
            return;
        }

        element.unitClone = (params) => {
            return this.cloneElement(position, params)
        }
    }

    this.length = function () {
        return this.children.length;
    }

    this.setProperties = function (properties = {}) {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].setProperties(properties);
        }
        this.element.setProperties(properties);
        for (let i in properties) {
            this.properties[i] = properties[i];
        }
    }

    this.css = function (style = {}) {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].css(style);
        }
        this.element.css(style);
    }

    this.setAttributes = function (attributes = {}) {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].setAttributes(attributes);
        }
        this.element.setAttributes(attributes);
    }

    this.addClasses = function (classes = '') {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].addClasses(classes);
        }
        this.element.addClasses(classes);
    }

    this.removeClasses = function (classes = '') {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].removeClasses(classes);
        }
        this.element.removeClasses(classes);
    }

    this.getChildren = function (identifier = '', element, positions = []) {
        let collection = [];
        let children = element.findAll(identifier);//get the children matching identifier in each element
        if (children.length > 0) {//if not empty
            for (let j = 0; j < positions.length; j++) {
                if (children[positions[j]] != undefined) {//if available
                    collection.push(children[positions[j]]);
                }
            }
        }
        return collection;
    }

    this.childCss = function (identifier = '', style = {}, positions = []) {
        positions = this.setPositions(positions);

        let children;
        for (let i = 0; i < this.children.length; i++) {
            children = this.getChildren(identifier, this.children[i], positions);

            for (let j = 0; j < children.length; j++) {
                children[j].css(style);
            }
        }

        children = this.getChildren(identifier, this.element, positions);

        for (let j = 0; j < children.length; j++) {
            children[j].css(style);
        }
    }

    this.setChildProperties = function (identifier = '', properties = {}, positions = []) {
        positions = this.setPositions(positions);

        let children;
        for (let i = 0; i < this.children.length; i++) {
            children = this.getChildren(identifier, this.children[i], positions);

            for (let j = 0; j < children.length; j++) {
                children[j].setProperties(properties);
            }
        }

        children = this.getChildren(identifier, this.element, positions);
        for (let j = 0; j < children.length; j++) {
            children[j].setProperties(properties);
        }

        this.childProperties[identifier] = this.childProperties[identifier] || [];
        this.childProperties[identifier].push({ properties, positions });
    }

    this.setChildAttributes = function (identifier = '', attributes = {}, positions = '') {
        positions = this.setPositions(positions);

        let children;
        for (let i = 0; i < this.children.length; i++) {
            children = this.getChildren(identifier, this.children[i], positions);

            for (let j = 0; j < children.length; j++) {
                children[j].setAttributes(attributes);
            }
        }

        children = this.getChildren(identifier, this.element, positions);

        for (let j = 0; j < children.length; j++) {
            children[j].setAttributes(attributes);
        }
    }

    this.addClassesToChild = function (identifier = '', classes = '', positions = []) {
        positions = this.setPositions(positions);

        let children;
        for (let i = 0; i < this.children.length; i++) {
            children = this.getChildren(identifier, this.children[i], positions);

            for (let j = 0; j < children.length; j++) {
                children[j].addClasses(classes);
            }
        }

        children = this.getChildren(identifier, this.element, positions);

        for (let j = 0; j < children.length; j++) {
            children[j].addClasses(classes);
        }
    }

    this.removeClassesFromChild = function (identifier = '', classes = '', positions = []) {
        positions = this.setPositions(positions);

        let children;
        for (let i = 0; i < this.children.length; i++) {
            children = this.getChildren(identifier, this.children[i], positions);

            for (let j = 0; j < children.length; j++) {
                children[j].removeClasses(classes);
            }
        }

        children = this.getChildren(identifier, this.element, positions);

        for (let j = 0; j < children.length; j++) {
            children[j].removeClasses(classes);
        }
    }
}

module.exports = Shadow;