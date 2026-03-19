import dotenv from 'dotenv';
import { createRequire } from 'module';
import { formatFileName } from '../utils/formatFileName.js';

dotenv.config();

const require = createRequire(import.meta.url);
let NodeID3 = null;
let geniusClient = null;

// Lazy-load optional dependencies so downloads still work even if
// lyrics packages are not installed or misconfigured.
try {
  NodeID3 = require('node-id3');
} catch {
  NodeID3 = null;
}

try {
  const Genius = require('genius-lyrics');
  geniusClient = new Genius.Client(process.env.GENIUS_TOKEN);
} catch {
  geniusClient = null;
}

/**
 * Searches Genius for lyrics and embeds them into the MP3 file via ID3 tags.
 * Non-fatal — silently returns if lyrics cannot be found or written.
 *
 * @param {string} fileName - Cleaned file name used as the search query.
 * @param {string} finalFilePath - Absolute path to the finished .mp3 file.
 */
export const embedLyricsIfPossible = async (fileName, finalFilePath) => {
  if (!NodeID3 || !geniusClient) return;
  if (!fileName) return;

  try {
    const results = await geniusClient.songs.search(fileName);
    if (!results || !results.length) return;

    const song = results[0];
    const lyrics = await song.lyrics();
    if (!lyrics) return;

    const tags = {
      unsynchronisedLyrics: {
        language: 'eng',
        text: lyrics,
      },
    };

    NodeID3.update(tags, finalFilePath);
  } catch (err) {
    console.error('Warning: failed to fetch/embed lyrics:', err.message || err);
  }
};
