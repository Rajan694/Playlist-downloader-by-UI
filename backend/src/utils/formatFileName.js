'use strict';

/**
 * Sanitises a video title for use as a safe filename.
 * Strips everything after the first special character and trims to 50 chars.
 */
function formatFileName(title) {
  if (!title) return 'audio';

  const clean = title.split(/[^a-zA-Z0-9 ]/)[0];
  return clean.trim().slice(0, 50) || 'audio';
}

module.exports = { formatFileName };
