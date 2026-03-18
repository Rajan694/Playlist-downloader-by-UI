'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/download.controller');
const { asyncWrap } = require('../middleware/asyncWrap');

const router = Router();

router.post('/start', asyncWrap(ctrl.start));
router.get('/progress/:jobId', ctrl.progress); // SSE — not wrapped (manages its own response)
router.delete('/cancel/:jobId', asyncWrap(ctrl.cancel));
router.get('/status/:jobId', asyncWrap(ctrl.status));

module.exports = router;
