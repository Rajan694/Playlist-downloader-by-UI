import ytDlp from 'yt-dlp-exec';

/**
 * Fetches full playlist metadata from YouTube via yt-dlp.
 * @param {string} url - YouTube playlist URL.
 * @returns {Promise<{title: string, items: Array}>}
 */
export const getPlaylistInfo = async (url) => {
  const result = await ytDlp(url, {
    dumpSingleJson: true,
    skipDownload: true,
  });

  if (!result || typeof result !== 'object') {
    throw new Error('Failed to parse playlist information.');
  }

  const entries = Array.isArray(result.entries)
    ? result.entries.filter(Boolean)
    : [];

  return {
    title: result.title || '',
    items: entries.map((entry) => {
      const categories = Array.isArray(entry.categories)
        ? entry.categories
        : [];
      const genre = categories.length ? categories[0] : '';
      const thumbnails = Array.isArray(entry.thumbnails)
        ? entry.thumbnails
        : [];
      const thumbnailUrl =
        entry.thumbnail ||
        (thumbnails.length &&
          (thumbnails[0].url || thumbnails[0].id || thumbnails[0].value)) ||
        '';

      return {
        id: entry.id,
        title: entry.title,
        duration: entry.duration || 0,
        artist: entry.artist || entry.uploader || entry.channel || '',
        album: entry.album || result.title || '',
        genre,
        thumbnail: thumbnailUrl,
      };
    }),
  };
};
