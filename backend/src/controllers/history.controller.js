'use strict';

const {
  getHistory,
  removeFromHistory,
} = require('../services/settings.service');

async function list(req, res) {
  const history = await getHistory();
  res.json(history);
}

async function remove(req, res) {
  const { id } = req.params;
  const updated = await removeFromHistory(id);
  res.json(updated);
}

module.exports = { list, remove };
