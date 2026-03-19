import path from 'path';
import os from 'os';

/**
 * Returns the OS-specific default Downloads folder path.
 * Falls back to the user's home directory if detection fails.
 */
export const getDefaultDownloadPath = () => path.join(os.homedir(), 'Downloads');
