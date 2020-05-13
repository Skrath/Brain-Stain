module.exports = {
    config: {
        loggingFlags: 0
    },
    
    internal: {
        loggingMasks: {
            development: 1,
            log: 2,
            warn: 4,
            error: 8,
            all: 1 + 2 + 4 + 8
        }
    }
};