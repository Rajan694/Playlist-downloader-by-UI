import { v4 as uuidv4 } from 'uuid';
import { downloadManager } from '../services/download.service.js';
import { getSettings, addToHistory, updateSettings } from '../services/settings.service.js';

/**
 * POST /api/download/start
 * Body: { playlistUrl, downloadPath?, items, playlistTitle? }
 *
 * Starts a background download job and returns the jobId.
 */
export const start = async (req, res) => {
  const { playlistUrl, downloadPath: bodyPath, items, playlistTitle } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: true, message: 'items array is required' });
  }

  // Resolve download path
  const settings = await getSettings();
  const downloadPath = bodyPath || settings.downloadPath;

  if (!downloadPath) {
    return res.status(400).json({ error: true, message: 'downloadPath is required' });
  }

  const jobId = uuidv4();
  const config = settings.downloadConfig || {};

  downloadManager.startJob(jobId, items, downloadPath, config);

  // Save to history and persist settings in background
  if (playlistUrl) {
    addToHistory(playlistUrl, playlistTitle || playlistUrl).catch(() => {});
    updateSettings({ downloadPath }).catch(() => {});
  }

  res.json({ jobId });
};

/**
 * GET /api/download/progress/:jobId
 * Server-Sent Events stream — emits real-time progress events.
 */
export const progress = (req, res) => {
  const { jobId } = req.params;
  const wantsSse = (req.headers.accept || '').includes('text/event-stream');

  const job = downloadManager.getJobStatus(jobId);
  console.log('🚀 ~ progress ~ job:', job);
  if (!job) {
    // If this is an SSE client (EventSource), send an SSE error event
    // so the frontend can read the message instead of a bare 404.
    if (wantsSse) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Job not found' })}\n\n`);
      res.end();
      return;
    }

    return res.status(404).json({ error: true, message: 'Job not found' });
  }

  // Setup SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  const onEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);

    // Close when job is complete
    if (data.type === 'done' || data.type === 'cancelled') {
      res.end();
    }
  };

  downloadManager.on(jobId, onEvent);

  // Clean up listener when client disconnects
  req.on('close', () => {
    downloadManager.removeListener(jobId, onEvent);
  });
};

/**
 * DELETE /api/download/cancel/:jobId
 * Cancels a running download job.
 */
export const cancel = (req, res) => {
  const { jobId } = req.params;
  const cancelled = downloadManager.cancelJob(jobId);

  if (!cancelled) {
    return res.status(404).json({ error: true, message: 'Job not found or not running' });
  }

  res.json({ message: 'Job cancelled' });
};

/**
 * GET /api/download/status/:jobId
 * Poll-based alternative to SSE — returns current job state snapshot.
 */
export const status = (req, res) => {
  const { jobId } = req.params;
  const job = downloadManager.getJobStatus(jobId);

  if (!job) {
    return res.status(404).json({ error: true, message: 'Job not found' });
  }

  res.json(job);
};
