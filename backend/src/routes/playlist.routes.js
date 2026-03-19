import { Router } from 'express';
import * as ctrl from '../controllers/playlist.controller.js';
import { asyncWrap } from '../middleware/asyncWrap.js';

const router = Router();

router.get('/info', asyncWrap(ctrl.info));

export default router;
