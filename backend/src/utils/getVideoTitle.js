import ytDlp from 'yt-dlp-exec';

/**
 * Fetches the title of a single YouTube video via yt-dlp.
 * @param {string} videoUrl - Full YouTube video URL.
 * @returns {Promise<string>} Resolved video title.
 */
export const getVideoTitle = (videoUrl) =>
  new Promise((resolve, reject) => {
    const subprocess = ytDlp.exec(videoUrl, {
      getTitle: true,
      quiet: true,
    });

    let title = '';

    subprocess.stdout.on('data', (chunk) => {
      title += chunk.toString();
    });

    subprocess.on('close', (code) => {
      if (code === 0) resolve(title.trim());
      else reject(new Error(`yt-dlp exited with code ${code} while fetching title`));
    });

    subprocess.on('error', reject);
  });
