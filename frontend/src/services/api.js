import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Match backend port
});

export const getSettings = () => api.get('/settings').then(res => res.data);
export const updateSettings = (data) => api.put('/settings', data).then(res => res.data);
export const getDefaultDownloadPath = () => api.get('/settings/default-download-path').then(res => res.data.downloadPath);

// Validate a filesystem path (directory + writable) from the backend
export const validateDownloadPath = (path) =>
  api
    .get('/fs/validate', { params: { path } })
    .then(res => res.data);

export const getHistory = () => api.get('/history').then(res => res.data);
export const deleteHistory = (id) => api.delete(`/history/${id}`).then(res => res.data);

export const getPlaylistInfo = (url, downloadPath) => {
  const params = { url };
  if (downloadPath) params.downloadPath = downloadPath;
  return api.get('/playlist/info', { params }).then(res => res.data);
};

export const startDownload = (data) => api.post('/download/start', data).then(res => res.data);
export const cancelDownload = (jobId) => api.delete(`/download/cancel/${jobId}`).then(res => res.data);
export const getDownloadStatus = (jobId) => api.get(`/download/status/${jobId}`).then(res => res.data);

// SSE connection helper
export const createProgressEventSource = (jobId) => {
  return new EventSource(`http://localhost:5000/api/download/progress/${jobId}`);
};
