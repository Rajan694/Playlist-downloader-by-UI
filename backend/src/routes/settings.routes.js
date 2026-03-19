import { Router } from 'express';
import * as ctrl from '../controllers/settings.controller.js';
import { asyncWrap } from '../middleware/asyncWrap.js';

const router = Router();

router.get('/', asyncWrap(ctrl.get));
router.put('/', asyncWrap(ctrl.update));
router.get('/default-download-path', asyncWrap(ctrl.defaultPath));

export default router;
