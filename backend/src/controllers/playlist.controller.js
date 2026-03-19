import { getPlaylistInfo } from '../services/playlist.service.js';
import { findExistingIds, estimateTotalSizeMb } from '../utils/fileScan.js';
import { getSettings } from '../services/settings.service.js';

/**
 * GET /api/playlist/info?url=<playlist_url>&downloadPath=<optional>
 *
 * Fetches playlist info, compares against the download folder,
 * and returns existing/missing breakdown with estimated size.
 */
export const info = async (req, res) => {
  const { url, downloadPath: queryPath } = req.query;

  if (!url) {
    return res.status(400).json({ error: true, message: 'url query param is required' });
  }

  // Use provided path, or fall back to saved settings
  let downloadPath = queryPath;
  if (!downloadPath) {
    const settings = await getSettings();
    downloadPath = settings.downloadPath;
  }

  const playlist = await getPlaylistInfo(url);

  if (!playlist.items.length) {
    return res.json({
      title: playlist.title,
      totalItems: 0,
      estimatedSizeMb: 0,
      downloadPath,
      existing: [],
      missing: [],
    });
  }

  const { existing, missing } = await findExistingIds(downloadPath, playlist.items);
  const estimatedSizeMb = estimateTotalSizeMb(missing);

  res.json({
    title: playlist.title,
    totalItems: playlist.items.length,
    estimatedSizeMb: Number(estimatedSizeMb.toFixed(2)),
    downloadPath,
    existing,
    missing,
  });
};
