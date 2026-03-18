'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/history.controller');
const { asyncWrap } = require('../middleware/asyncWrap');

const router = Router();

router.get('/', asyncWrap(ctrl.list));
router.delete('/:id', asyncWrap(ctrl.remove));

module.exports = router;
