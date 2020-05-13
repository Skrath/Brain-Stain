const yaml = require('js-yaml');
const fs = require('fs');

var variables = require("../init/variables.js");

module.exports = {
    log: function(text, level = variables.internal.loggingMasks.log) {
        if (variables.config.loggingFlags & level) {
            console.log(text);
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

            global.variables = variables;
            
        } catch (e) {
            console.log(e, variables.internal.loggingMasks.error);
        }
    }
}