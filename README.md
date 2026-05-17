# local-logger

A simple reusable Node.js logger that writes timestamped messages to a local file. Each application start creates a new log file in a `logs/` folder.

## Features

- Writes logs to a local file in `logs/`
- Generates a fresh log file on each application startup
- Supports `log`, `info`, `warn`, and `error`
- Includes ISO timestamp and calling function name in each entry
- Designed for local development and npm reuse

## Install

```bash
npm i pd-local-logger
```

## Usage

```js
const logger = require('local-logger');

function runApp() {
  logger.log('Application started');
  logger.info('Service initialized');
  logger.warn('Cache is almost full');
  logger.error(new Error('Something went wrong'));
}

runApp();
```

## Custom logger instance

```js
const { createLogger } = require('local-logger');

const logger = createLogger({
  logDirectory: './logs',
  filenamePrefix: 'my-app',
  level: 'info'
});

logger.log('Hello from custom logger');
```

## Notes

- A new file is created when the logger is initialized.
- The package is intended for local development and ease of use in other applications.
