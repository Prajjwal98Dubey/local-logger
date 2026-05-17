const logger = require('../index');

function startExample() {
  logger.log('Demo application started');
  logger.info('Info-level message');
  logger.warn('Warning-level message');
  logger.error('Error-level message');
}

startExample();
