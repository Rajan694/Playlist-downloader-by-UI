'use strict';

const fs = require('fs').promises;
const path = require('path');
const { getDefaultDownloadPath } = require('../utils/defaultDownloadPath');

const SETTINGS_PATH = path.join(__dirname, '../data/settings.json');
const HISTORY_PATH = path.join(__dirname, '../data/history.json');

const MAX_HISTORY = 5;

// ──────────────── Settings ────────────────

const DEFAULT_SETTINGS = {
  defaultPlaylistUrl: '',
  downloadPath: getDefaultDownloadPath(),
  theme: 'glassmorphic',
  downloadConfig: {
    audioQuality: 0, // yt-dlp quality 0 = best, 10 = worst
    wantLyrics: true,
  },
};

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, data) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

async function getSettings() {
  const saved = await readJson(SETTINGS_PATH, {});
  return { ...DEFAULT_SETTINGS, ...saved };
}

async function updateSettings(partial) {
  const current = await getSettings();

  // Merge downloadConfig separately so partial updates work
  const downloadConfig = {
    ...current.downloadConfig,
    ...(partial.downloadConfig || {}),
  };

  const updated = {
    ...current,
    ...partial,
    downloadConfig,
  };

  await writeJson(SETTINGS_PATH, updated);
  return updated;
}

// ──────────────── History ────────────────

async function getHistory() {
  return readJson(HISTORY_PATH, []);
}

/**
 * Adds a playlist to the recent history (max 5, most recent first).
 * If a URL already exists it moves it to the top.
 */
async function addToHistory(url, title) {
  const list = await getHistory();

  // Remove duplicates
  const filtered = list.filter((item) => item.url !== url);

  const entry = {
    id: Date.now().toString(),
    url,
    title: title || url,
    usedAt: new Date().toISOString(),
  };

  filtered.unshift(entry);
  const trimmed = filtered.slice(0, MAX_HISTORY);

  await writeJson(HISTORY_PATH, trimmed);
  return trimmed;
}

async function removeFromHistory(id) {
  const list = await getHistory();
  const filtered = list.filter((item) => item.id !== id);
  await writeJson(HISTORY_PATH, filtered);
  return filtered;
}

module.exports = {
  getSettings,
  updateSettings,
  getHistory,
  addToHistory,
  removeFromHistory,
};
