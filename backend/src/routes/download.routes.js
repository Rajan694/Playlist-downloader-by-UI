import { Router } from 'express';
import * as ctrl from '../controllers/download.controller.js';
import { asyncWrap } from '../middleware/asyncWrap.js';

const router = Router();

router.post('/start', asyncWrap(ctrl.start)); // start download
router.get('/progress/:jobId', ctrl.progress); // SSE — not wrapped (manages its own response)
router.delete('/cancel/:jobId', asyncWrap(ctrl.cancel)); // cancel download
router.get('/status/:jobId', asyncWrap(ctrl.status)); // get status

export default router;
