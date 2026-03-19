import { promises as fs, constants as fsConstants } from 'fs';

/**
 * Checks whether a directory path exists and is writable.
 * @param {string} dirPath - Absolute path to validate.
 * @returns {Promise<{valid: boolean, reason?: string}>}
 */
export const validatePath = async (dirPath) => {
  if (!dirPath || typeof dirPath !== 'string') {
    return { valid: false, reason: 'Path is required' };
  }

  try {
    const stat = await fs.stat(dirPath);
    if (!stat.isDirectory()) {
      return { valid: false, reason: 'Path is not a directory' };
    }
    await fs.access(dirPath, fsConstants.W_OK);
    return { valid: true };
  } catch (err) {
    if (err.code === 'ENOENT') {
      return { valid: false, reason: 'Directory does not exist' };
    }
    if (err.code === 'EACCES') {
      return { valid: false, reason: 'Directory is not writable' };
    }
    return { valid: false, reason: err.message };
  }
};
