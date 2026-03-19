import { validatePath } from '../utils/validatePath.js';

/**
 * GET /api/fs/validate?path=<dir>
 * Checks if a directory exists and is writable.
 */
export const validate = async (req, res) => {
  const dirPath = req.query.path;

  if (!dirPath) {
    return res.status(400).json({ error: true, message: 'path query param is required' });
  }

  const result = await validatePath(dirPath);
  res.json(result);
};
