'use strict';

const express = require('express');
const cors = require('cors');

const settingsRoutes = require('./routes/settings.routes');
const historyRoutes = require('./routes/history.routes');
const playlistRoutes = require('./routes/playlist.routes');
const downloadRoutes = require('./routes/download.routes');
const fsRoutes = require('./routes/fs.routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// ──────────────── Middleware ────────────────
app.use(cors());
app.use(express.json());

// ──────────────── Routes ────────────────
app.use('/api/settings', settingsRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/playlist', playlistRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/fs', fsRoutes);

// ──────────────── Health check ────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ──────────────── Error handler (must be last) ────────────────
app.use(errorHandler);

module.exports = app;
