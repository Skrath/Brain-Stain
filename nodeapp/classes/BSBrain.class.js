module.exports = class BSBrain {
    constructor() {

    }

    input(userObject) {
        this.userObject = userObject;

        this.parseDate({day: userObject.day, month: userObject.month, year: userObject.year});
        this.parseTime({hour: userObject.hour, minute: userObject.minute});
        this.parseLocation({latitude: userObject.latitude, longitude: userObject.longitude});

        ['browserName', 'osName', 'cpuArchitecture', 'country', 'region', 'timezone', 'city', 'languageCode', 'languageRegion', ].forEach(varName => {
            this[varName] = this.textToDecimal(userObject[varName]);
        });

        ['browserMajorVersion', 'browserVersion'].forEach(varName => {
            this[varName] = this.numberToFraction(userObject[varName]);
        });

        this.osVersion = this.numberToFraction(userObject.osVersion, 2);
        this.metro = this.numberToFraction(userObject.metro, 4);
        this.area = this.numberToFraction(userObject.area, 4);
    }

    parseDate(date = {}) {
        this.day = Number(date.day) / 31;
        this.month = Number(date.month) / 12;
        this.year = this.numberToFraction(date.year);
    }

    parseTime(time = {}) {
        this.hour = Number(time.hour) / 24;
        this.minute = Number(time.minute) / 60;
    }

    parseLocation(coordinates = {}) {
        this.latitude = (coordinates.latitude + 90) / 180;
        this.longitude = (coordinates.longitude + 180) / 360;
    }

    textToDecimal(textString = '') {
        var code = 0;
        
        [...textString].forEach(character => {
            code += character.charCodeAt();
        });
        
        return this.numberToFraction(code);
    }

    // This needs some documentation
    numberToFraction(number, scaleDepth = 0) {
        number = number.toString().replace(/\./gi, '');

        return number / (10 ** Math.max( number.length, scaleDepth));
    }
}