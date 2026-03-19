import { Router } from 'express';
import * as ctrl from '../controllers/download.controller.js';
import { asyncWrap } from '../middleware/asyncWrap.js';

const router = Router();

router.post('/start', asyncWrap(ctrl.start));
router.get('/progress/:jobId', ctrl.progress); // SSE — not wrapped (manages its own response)
router.delete('/cancel/:jobId', asyncWrap(ctrl.cancel));
router.get('/status/:jobId', asyncWrap(ctrl.status));

export default router;
