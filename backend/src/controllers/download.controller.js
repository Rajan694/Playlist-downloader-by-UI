'use strict';

const { v4: uuidv4 } = require('uuid');
const { downloadManager } = require('../services/download.service');
const {
  getSettings,
  addToHistory,
  updateSettings,
} = require('../services/settings.service');

/**
 * POST /api/download/start
 * Body: { playlistUrl, downloadPath?, items, playlistTitle? }
 *
 * Starts a background download job and returns the jobId.
 */
async function start(req, res) {
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
}

/**
 * GET /api/download/progress/:jobId
 * Server-Sent Events stream — emits real-time progress events.
 */
function progress(req, res) {
  const { jobId } = req.params;

  const job = downloadManager.getJobStatus(jobId);
  if (!job) {
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
}

/**
 * DELETE /api/download/cancel/:jobId
 * Cancels a running download job.
 */
function cancel(req, res) {
  const { jobId } = req.params;
  const cancelled = downloadManager.cancelJob(jobId);

  if (!cancelled) {
    return res.status(404).json({ error: true, message: 'Job not found or not running' });
  }

  res.json({ message: 'Job cancelled' });
}

/**
 * GET /api/download/status/:jobId
 * Poll-based alternative to SSE — returns current job state snapshot.
 */
function status(req, res) {
  const { jobId } = req.params;
  const job = downloadManager.getJobStatus(jobId);

  if (!job) {
    return res.status(404).json({ error: true, message: 'Job not found' });
  }

  res.json(job);
}

module.exports = { start, progress, cancel, status };
