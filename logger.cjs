const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'logs', 'system_errors.log');

function logError(message, context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ERROR: ${message} | CONTEXT: ${JSON.stringify(context)}\n`;
    
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) console.error("Logger failed to write to file:", err);
    });
    console.error(logEntry);
}

function logInfo(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] INFO: ${message}\n`;
    
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) console.error("Logger failed to write to file:", err);
    });
    console.log(logEntry);
}

module.exports = { logError, logInfo };
