var Color = require('color');

module.exports = class BSColor {
    constructor(input) {
        this.ratioValue = 16777215;
        this.color = Color(input);
    }

    set nodeValue(input) {
        var newColor = input * this.ratioValue;
        this.color = Color(newColor);
    }

    get nodeValue() {
        if (this.color.rgbNumber() == 0) return 0;
        return  this.color.rgbNumber() / this.ratioValue;
    }
}