import path from 'path';
import { promises as fs } from 'fs';
import { EventEmitter } from 'events';
import ytDlp from 'yt-dlp-exec';
import { formatFileName } from '../utils/formatFileName.js';
import { getVideoTitle } from '../utils/getVideoTitle.js';
import { embedLyricsIfPossible } from './lyrics.service.js';

/**
 * DownloadManager — manages multiple download jobs.
 * Each job downloads a list of items sequentially, emitting progress events.
 *
 * Usage:
 *   const jobId = manager.startJob(items, outputDir, config);
 *   manager.on(jobId, (event) => { ... });
 *   manager.cancelJob(jobId);
 *   manager.getJobStatus(jobId);
 */
class DownloadManager extends EventEmitter {
  constructor() {
    super();
    /** @type {Map<string, object>} */
    this.jobs = new Map();
  }

  /**
   * Starts a new download job.
   * @param {string} jobId - Unique identifier for this job.
   * @param {Array} items - Playlist items to download (each has id, title, duration).
   * @param {string} outputDir - Absolute path to save files.
   * @param {{audioQuality: number, wantLyrics: boolean}} config - Download config.
   */
  startJob(jobId, items, outputDir, config = {}) {
    const job = {
      id: jobId,
      status: 'running',       // running | completed | cancelled | error
      total: items.length,
      completed: 0,
      failed: 0,
      currentItem: null,
      items: items.map((i) => ({ ...i, status: 'pending' })),
      subprocess: null,
    };

    this.jobs.set(jobId, job);
    this._processJob(jobId, items, outputDir, config);
    return job;
  }

  /**
   * Cancels a running job.
   */
  cancelJob(jobId) {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'running') return false;

    job.status = 'cancelled';
    if (job.subprocess) {
      try { job.subprocess.kill('SIGTERM'); } catch { /* ignore */ }
    }

    this._emitEvent(jobId, {
      type: 'cancelled',
      message: 'Download cancelled by user',
    });

    return true;
  }

  /**
   * Returns current status of a job.
   */
  getJobStatus(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    return {
      id: job.id,
      status: job.status,
      total: job.total,
      completed: job.completed,
      failed: job.failed,
      currentItem: job.currentItem,
      items: job.items.map(({ id, title, status }) => ({ id, title, status })),
    };
  }

  // ──────────────── Internal ────────────────

  async _processJob(jobId, items, outputDir, config) {
    const job = this.jobs.get(jobId);

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    for (let i = 0; i < items.length; i++) {
      if (job.status === 'cancelled') break;

      const item = items[i];
      job.currentItem = { id: item.id, title: item.title, index: i };
      job.items[i].status = 'downloading';

      this._emitEvent(jobId, {
        type: 'progress',
        itemId: item.id,
        title: item.title,
        index: i,
        total: items.length,
        percent: 0,
        status: 'downloading',
      });

      try {
        await this._downloadSingleItem(jobId, item, outputDir, config);
        job.items[i].status = 'complete';
        job.completed += 1;

        this._emitEvent(jobId, {
          type: 'progress',
          itemId: item.id,
          title: item.title,
          index: i,
          total: items.length,
          percent: 100,
          status: 'complete',
        });
      } catch (err) {
        job.items[i].status = 'failed';
        job.failed += 1;

        this._emitEvent(jobId, {
          type: 'progress',
          itemId: item.id,
          title: item.title,
          index: i,
          total: items.length,
          percent: 0,
          status: 'failed',
          error: err.message,
        });

        // Clean up corrupt partial file
        await this._cleanupFailedFile(item, outputDir);

        this._emitEvent(jobId, {
          type: 'progress',
          itemId: item.id,
          title: item.title,
          index: i,
          total: items.length,
          percent: 0,
          status: 'cleanup',
        });
      }
    }

    if (job.status !== 'cancelled') {
      job.status = job.failed === job.total ? 'error' : 'completed';
    }
    job.currentItem = null;

    this._emitEvent(jobId, {
      type: 'done',
      status: job.status,
      completed: job.completed,
      failed: job.failed,
      total: job.total,
    });
  }

  async _downloadSingleItem(jobId, item, outputDir, config) {
    const job = this.jobs.get(jobId);
    const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;

    const rawTitle = await getVideoTitle(videoUrl);
    const fileName = formatFileName(rawTitle);
    const outputTemplate = path.join(outputDir, `${fileName} [%(id)s].%(ext)s`);
    const finalFilePath = path.join(outputDir, `${fileName} [${item.id}].mp3`);

    const audioQuality = config.audioQuality ?? 0;
    const wantLyrics = config.wantLyrics !== false;

    return new Promise((resolve, reject) => {
      const subprocess = ytDlp.exec(videoUrl, {
        output: outputTemplate,
        extractAudio: true,
        audioFormat: 'mp3',
        audioQuality,
        addMetadata: true,
        embedThumbnail: true,
        noWarnings: true,
        progress: true,
      }, {
        stderr: 'pipe',
        stdout: 'pipe',
      });

      // Store ref so we can kill on cancel
      job.subprocess = subprocess;

      const handleChunk = (chunk) => {
        const text = chunk.toString();
        const match = text.match(/(\d+(?:\.\d+)?)%/);
        if (match) {
          const percent = Number.parseFloat(match[1]);
          if (!Number.isNaN(percent)) {
            this._emitEvent(jobId, {
              type: 'progress',
              itemId: item.id,
              title: item.title,
              percent,
              status: 'downloading',
            });
          }
        }
      };

      if (subprocess.stderr) subprocess.stderr.on('data', handleChunk);
      if (subprocess.stdout) subprocess.stdout.on('data', handleChunk);

      subprocess.on('error', (err) => reject(err));

      subprocess.on('close', async (code) => {
        job.subprocess = null;

        if (code !== 0) {
          reject(new Error(`yt-dlp exited with code ${code}`));
          return;
        }

        // Embed lyrics if enabled
        if (wantLyrics) {
          await embedLyricsIfPossible(fileName, finalFilePath);
        }

        resolve();
      });
    });
  }

  async _cleanupFailedFile(item, outputDir) {
    try {
      const files = await fs.readdir(outputDir);
      const partial = files.find((f) => f.includes(`[${item.id}]`));
      if (partial) {
        await fs.unlink(path.join(outputDir, partial));
      }
    } catch {
      // Cleanup is best-effort
    }
  }

  _emitEvent(jobId, data) {
    this.emit(jobId, data);
  }
}

// Singleton instance shared across the app
const downloadManager = new DownloadManager();

export { downloadManager };
