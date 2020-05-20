class bitmask {
    constructor(keys) {
        this.masks = {};
        this.total = 0;

        keys.forEach(name => {
            let maskValue = Math.pow(2, Object.keys(this.masks).length)
            this.masks[name] = maskValue;
            this.total += maskValue;

            Object.defineProperty(this, name, {
                get: function () { return this.masks[name]; }
            });
        });
    }

    lookup(maskValue) {
        let output;
        Object.keys(this.masks).forEach(name => {
            if (maskValue == this.masks[name]) {
                output = name;
            }
        });

        return output;
    }

    get all() {
        return this.total;
    }
}

module.exports = {
    config: {
        loggingFlags: 0
    },
    
    internal: {
        loggingMasks: new bitmask(['development', 'log', 'warn', 'error']),
        loggingLocationsMasks: new bitmask(['console', 'disk'])
    }
};