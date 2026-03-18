'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/settings.controller');
const { asyncWrap } = require('../middleware/asyncWrap');

const router = Router();

router.get('/', asyncWrap(ctrl.get));
router.put('/', asyncWrap(ctrl.update));
router.get('/default-download-path', asyncWrap(ctrl.defaultPath));

module.exports = router;
