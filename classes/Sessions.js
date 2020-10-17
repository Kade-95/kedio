class Sessions {
    constructor(key) {
        this.key = key;
        this.time;
        this.active = false;
    }

    set(item) {
        for (let i in item) {
            this[i] = item[i];
        }
    }

    unset(item) {
        for (var i of item) delete this[i];
    }
}

module.exports = Sessions;