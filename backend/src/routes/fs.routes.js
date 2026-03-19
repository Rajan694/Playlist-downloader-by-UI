import { Router } from 'express';
import * as ctrl from '../controllers/fs.controller.js';
import { asyncWrap } from '../middleware/asyncWrap.js';

const router = Router();

router.get('/validate', asyncWrap(ctrl.validate)); //validate path entered

export default router;
