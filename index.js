const { createLogger } = require('./src/logger');

const logger = createLogger();

module.exports = logger;
module.exports.createLogger = createLogger;
