var geoip = require('geoip-lite');
var uaParser = require('ua-parser-js');
var languageParser = require('accept-language-parser');
var moment = require('moment-timezone');

var tools = require("../utility/tools.js");

module.exports = class BSUser {
    constructor(req) {
        var ua = uaParser(req.headers['user-agent']);
        var languages = languageParser.parse(req.headers['accept-language']);
        
        this.ip = req.ip;
        if (global.variables.config.devMode && Array.isArray(global.variables.config.developmentSettings.spoofIPs)) {
            this.ip = global.variables.config.developmentSettings.spoofIPs[Math.floor(Math.random() * global.variables.config.developmentSettings.spoofIPs.length)];
            tools.log('Using spoofed ip of: ' + this.ip, global.variables.internal.logLevelMasks.development);
        }
        
        var geo = geoip.lookup(this.ip);

        if ( (ua !== null) && (ua !== undefined)) {
            this.browserName = ua.browser.name;
            this.browserMajorVersion = ua.browser.major;
            this.browserVersion = ua.browser.version;
            this.osName = ua.os.name;
            this.osVersion = ua.os.version;
            this.cpuArchitecture = ua.cpu.architecture;
        }

        if ( (geo !== null) && (geo !== undefined )) {
            this.country = geo.country;
            this.region = geo.region;
            // look up what geo.eu is
            this.timezone = geo.timezone;
            this.city = geo.city;
            this.latitude = geo.ll[0];
            this.longitude = geo.ll[1];
            this.metro = geo.metro;
            this.area = geo.area;
        }

        if ( (languages !== null) && (languages !== undefined)) {
            // We're only going to deal with the top result
            this.languageCode = languages[0].code;
            this.languageRegion = languages[0].region;
        }

        if (this.timezone !== undefined) {
            var currentTime = moment().tz(this.timezone);
            this.day = currentTime.format('DD');
            this.month = currentTime.format('MM');
            this.year = currentTime.format('YYYY');
            this.hour = currentTime.format('HH');
            this.minute = currentTime.format('mm');
        }
    }
};