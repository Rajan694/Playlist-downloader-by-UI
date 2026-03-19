import express from 'express';
import cors from 'cors';

import settingsRoutes from './routes/settings.routes.js';
import historyRoutes from './routes/history.routes.js';
import playlistRoutes from './routes/playlist.routes.js';
import downloadRoutes from './routes/download.routes.js';
import fsRoutes from './routes/fs.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

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

export default app;
