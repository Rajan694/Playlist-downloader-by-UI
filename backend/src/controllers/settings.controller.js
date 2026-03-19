import { getSettings, updateSettings } from '../services/settings.service.js';
import { getDefaultDownloadPath } from '../utils/defaultDownloadPath.js';

export const get = async (req, res) => {
  const settings = await getSettings();
  res.json(settings);
};

export const update = async (req, res) => {
  const updated = await updateSettings(req.body);
  res.json(updated);
};

export const defaultPath = async (req, res) => {
  const downloadPath = getDefaultDownloadPath();
  res.json({ downloadPath });
};
