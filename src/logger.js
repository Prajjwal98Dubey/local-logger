const fs = require('fs');
const path = require('path');

class Logger {
  constructor(options = {}) {
    const defaultDir = path.resolve(process.cwd(), 'logs');
    const defaultPrefix = 'app-log';

    this.logDirectory = path.resolve(options.logDirectory || defaultDir);
    this.filenamePrefix = options.filenamePrefix || defaultPrefix;
    this.level = options.level || 'info';
    this.levels = ['error', 'warn', 'info', 'log'];

    this._ensureLogDirectory();
    this.filePath = this._createLogFile();
    this.stream = fs.createWriteStream(this.filePath, { flags: 'a', encoding: 'utf8' });
  }

  _ensureLogDirectory() {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  _createLogFile() {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const filename = `${this.filenamePrefix}-${timestamp}.log`;
    return path.join(this.logDirectory, filename);
  }

  _getCallerName() {
    const stack = new Error().stack;
    if (!stack) {
      return 'unknown';
    }

    const stackLines = stack.split('\n').map(line => line.trim());
    for (let i = 2; i < stackLines.length; i += 1) {
      const line = stackLines[i];
      if (line.includes('src/logger.js') || line.includes('index.js')) {
        continue;
      }

      const match = line.match(/at (.+?) \(/);
      if (match && match[1]) {
        return match[1];
      }

      const simpleMatch = line.match(/at (.+)/);
      if (simpleMatch && simpleMatch[1]) {
        return simpleMatch[1];
      }
    }

    return 'anonymous';
  }

  _formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    const caller = this._getCallerName();
    const text = typeof message === 'string' ? message : JSON.stringify(message, null, 2);
    return `[${timestamp}] [${level.toUpperCase()}] [${caller}] ${text}\n`;
  }

  _write(level, message) {
    if (this.levels.indexOf(level) > this.levels.indexOf(this.level)) {
      return;
    }

    const formatted = this._formatMessage(level, message);
    if (this.stream.writable) {
      this.stream.write(formatted);
    } else {
      fs.appendFileSync(this.filePath, formatted, 'utf8');
    }
  }

  log(message) {
    return this._write('log', message);
  }

  info(message) {
    return this._write('info', message);
  }

  warn(message) {
    return this._write('warn', message);
  }

  error(message) {
    const text = message instanceof Error ? message.stack || message.message : message;
    return this._write('error', text);
  }
}

function createLogger(options) {
  return new Logger(options);
}

module.exports = { Logger, createLogger };
