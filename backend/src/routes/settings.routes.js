import { Router } from 'express';
import * as ctrl from '../controllers/settings.controller.js';
import { asyncWrap } from '../middleware/asyncWrap.js';

const router = Router();

router.get('/', asyncWrap(ctrl.get)); //get settings
router.put('/', asyncWrap(ctrl.update)); //update settings
router.get('/default-download-path', asyncWrap(ctrl.defaultPath)); //gets default path

export default router;
