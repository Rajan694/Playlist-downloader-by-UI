import {
  getHistory,
  removeFromHistory,
} from '../services/settings.service.js';

export const list = async (req, res) => {
  const history = await getHistory();
  res.json(history);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  const updated = await removeFromHistory(id);
  res.json(updated);
};
