'use strict';

const { getSettings, updateSettings } = require('../services/settings.service');
const { getDefaultDownloadPath } = require('../utils/defaultDownloadPath');

async function get(req, res) {
  const settings = await getSettings();
  res.json(settings);
}

async function update(req, res) {
  const updated = await updateSettings(req.body);
  res.json(updated);
}

async function defaultPath(req, res) {
  const downloadPath = getDefaultDownloadPath();
  res.json({ downloadPath });
}

module.exports = { get, update, defaultPath };
