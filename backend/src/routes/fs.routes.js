'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/fs.controller');
const { asyncWrap } = require('../middleware/asyncWrap');

const router = Router();

router.get('/validate', asyncWrap(ctrl.validate));

module.exports = router;
