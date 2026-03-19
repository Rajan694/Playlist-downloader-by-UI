import { Router } from 'express';
import * as ctrl from '../controllers/history.controller.js';
import { asyncWrap } from '../middleware/asyncWrap.js';

const router = Router();

router.get('/', asyncWrap(ctrl.list));
router.delete('/:id', asyncWrap(ctrl.remove));

export default router;
