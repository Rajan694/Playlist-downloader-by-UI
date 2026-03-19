import { Router } from 'express';
import * as ctrl from '../controllers/history.controller.js';
import { asyncWrap } from '../middleware/asyncWrap.js';

const router = Router();

router.get('/', asyncWrap(ctrl.list)); //get recent used playlists
router.delete('/:id', asyncWrap(ctrl.remove)); //delete a playlist

export default router;
