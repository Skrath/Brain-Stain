const yaml = require('js-yaml');
const fs = require('fs');
const moment = require('moment-timezone');

var variables = require("../init/variables.js");

module.exports = {
    log: function(text, level = variables.internal.logLevelMasks.log) {
        if (variables.config.logLevelFlags & level) {
            let currentTime = moment();
            let levelName = variables.internal.logLevelMasks.lookup(level);
            let prefix = '[' + currentTime.format(global.variables.config.timeFormat) + '] [' + levelName + '] ';
            let logMessage = prefix + text;

            if (variables.config.logLocationFlags & variables.internal.logLocationMasks.console) {
                console.log(logMessage);
            }

            if (variables.config.logLocationFlags & variables.internal.logLocationMasks.disk) {
                let filename = currentTime.format(global.variables.config.dateFormat)

                if (variables.config.splitLogsByLevelFlags & level) {
                    filename += '_' + levelName;
                }
                filename += '.log';

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
                variables.config.logLevelFlags |= variables.internal.logLevelMasks.development;
            } else {
                variables.config.devMode = false;
            }
    
            ['logLevel', 'logLocation', 'splitLogsByLevel'].forEach(name => {
                if (Array.isArray(variables.config[name])) {
                    variables.config[name].forEach(item => {
                        variables.config[name + 'Flags'] |= variables.internal[name + 'Masks'][item];
                    });
                }
            });

            global.variables = variables;
        } catch (e) {
            console.log(e);
        }
    }
}