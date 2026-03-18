'use strict';

const fs = require('fs').promises;

const AVERAGE_BITRATE_KBPS = 192;
const SAFETY_FACTOR = 1.25;

/**
 * Estimates total download size in MB for a list of entries.
 * @param {Array<{duration: number}>} entries
 * @returns {number} Estimated size in MB.
 */
function estimateTotalSizeMb(entries) {
  const totalSeconds = entries.reduce((sum, e) => sum + (e.duration || 0), 0);
  const totalBytes = totalSeconds * ((AVERAGE_BITRATE_KBPS * 1000) / 8) * SAFETY_FACTOR;
  return totalBytes / (1024 * 1024);
}

/**
 * Scans `targetDir` for .mp3 files whose name contains a YouTube video ID,
 * and partitions `playlistItems` into existing / missing arrays.
 */
async function findExistingIds(targetDir, playlistItems) {
  let files = [];
  try {
    files = await fs.readdir(targetDir);
  } catch {
    // Directory might not exist yet — everything is missing.
    return { existing: [], missing: [...playlistItems] };
  }

  const existingIds = new Set();
  const idPattern = /\[([A-Za-z0-9_-]{6,})\]\.mp3$/;

  for (const file of files) {
    const match = file.match(idPattern);
    if (match) existingIds.add(match[1]);
  }

  const existing = [];
  const missing = [];

  for (const item of playlistItems) {
    if (item.id && existingIds.has(item.id)) existing.push(item);
    else missing.push(item);
  }

  return { existing, missing };
}

module.exports = { estimateTotalSizeMb, findExistingIds };
