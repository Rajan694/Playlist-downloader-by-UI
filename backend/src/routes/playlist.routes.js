'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/playlist.controller');
const { asyncWrap } = require('../middleware/asyncWrap');

const router = Router();

router.get('/info', asyncWrap(ctrl.info));

module.exports = router;
