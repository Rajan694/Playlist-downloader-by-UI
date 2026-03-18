'use strict';

const { validatePath } = require('../utils/validatePath');

/**
 * GET /api/fs/validate?path=<dir>
 * Checks if a directory exists and is writable.
 */
async function validate(req, res) {
  const dirPath = req.query.path;

  if (!dirPath) {
    return res.status(400).json({ error: true, message: 'path query param is required' });
  }

  const result = await validatePath(dirPath);
  res.json(result);
}

module.exports = { validate };
