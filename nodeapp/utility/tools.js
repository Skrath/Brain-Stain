const yaml = require('js-yaml');
const fs = require('fs');
const moment = require('moment-timezone');

var variables = require("../init/variables.js");

module.exports = {
    log: function(text, level = variables.internal.loggingMasks.log) {
        if (variables.config.loggingFlags & level) {
            let currentTime = moment();
            let levelName = variables.internal.loggingMasks.lookup(level);
            let prefix = '[' + currentTime.format('HH:mm:ss') + '] [' + levelName + '] ';
            let logMessage = prefix + text;

            if (variables.config.loggingLocationFlags & variables.internal.loggingLocationsMasks.console) {
                console.log(logMessage);
            }

            if (variables.config.loggingLocationFlags & variables.internal.loggingLocationsMasks.disk) {
                let filename = currentTime.format('MM-DD-YYYY') + '.log';

                fs.appendFile('./logs/' + filename, logMessage + "\n", function (err) {
                    if (err) throw err;
                });
            }
        }
    },

    loadConfig: function() {
        try {
            let fileContents = fs.readFileSync('./config/main.yml', 'utf8');
            variables.config = yaml.safeLoad(fileContents);
    
            if (variables.config.devMode) {
                variables.config.loggingFlags |= variables.internal.loggingMasks.development;
            } else {
                variables.config.devMode = false;
            }
    
            if (Array.isArray(variables.config.logLevel)) {
                variables.config.logLevel.forEach(function(item) {
                    variables.config.loggingFlags |= variables.internal.loggingMasks[item];
                });
            }

            if (Array.isArray(variables.config.logLocations)) {
                variables.config.logLocations.forEach(function(item) {
                    variables.config.loggingLocationFlags |= variables.internal.loggingLocationsMasks[item];
                });
            }

            global.variables = variables;
            
        } catch (e) {
            console.log(e, variables.internal.loggingMasks.error);
        }
    }
}