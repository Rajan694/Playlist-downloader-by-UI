'use strict';

const path = require('path');
const os = require('os');

/**
 * Returns the OS-specific default Downloads folder path.
 * Falls back to the user's home directory if detection fails.
 */
function getDefaultDownloadPath() {
  return path.join(os.homedir(), 'Downloads');
}

module.exports = { getDefaultDownloadPath };
