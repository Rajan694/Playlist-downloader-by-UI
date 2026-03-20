import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFolder, FiCheckCircle, FiClock, FiDownload, FiSettings, FiMusic } from 'react-icons/fi';
import { PlaylistDropdown } from '../components/ui/PlaylistDropdown';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  getSettings,
  getPlaylistInfo,
  startDownload,
  cancelDownload,
  createProgressEventSource,
} from '../services/api';
import { useTheme } from '../context/ThemeContext';

export const Home = () => {
  const [url, setUrl] = useState('');
  const [defaultUrl, setDefaultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [playlistData, setPlaylistData] = useState(null);

  const [jobId, setJobId] = useState(null);
  const [progressData, setProgressData] = useState({});
  const [jobStatus, setJobStatus] = useState(null); // 'running', 'completed', 'error', 'cancelled'

  const { themeConfig } = useTheme();

  useEffect(() => {
    getSettings().then((s) => s?.defaultPlaylistUrl && setDefaultUrl(s.defaultPlaylistUrl));
  }, []);

  useEffect(() => {
    if (!jobId) return;

    const sse = createProgressEventSource(jobId);
    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'progress') {
          setProgressData((prev) => ({
            ...prev,
            [data.itemId]: {
              percent: data.percent,
              status: data.status,
              title: data.title,
            },
          }));
        } else if (data.type === 'done' || data.type === 'cancelled') {
          setJobStatus(data.status);
          sse.close();
        } else if (data.type === 'error') {
          // Optional: store/display the message
          console.error('Download job error:', data.message);
          setJobStatus('error');
          sse.close();
        }
      } catch (e) {
        console.error('SSE parse error', e);
      }
    };
    return () => sse.close();
  }, [jobId]);

  const fetchPlaylist = async (targetUrl) => {
    setLoading(true);
    setPlaylistData(null);
    setJobId(null);
    setProgressData({});
    setJobStatus(null);

    try {
      const data = await getPlaylistInfo(targetUrl);
      setPlaylistData(data);
    } catch (e) {
      console.error(e);
      alert('Failed to fetch playlist information. Check URL or Backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    if (url) fetchPlaylist(url);
  };

  const handleUseDefault = () => {
    setUrl(defaultUrl);
    fetchPlaylist(defaultUrl);
  };

  const handleStartDownload = async () => {
    if (!playlistData || !playlistData.missing.length) return;
    try {
      const res = await startDownload({
        playlistUrl: url,
        items: playlistData.missing,
        playlistTitle: playlistData.title,
      });
      setJobId(res.jobId);
      setJobStatus('running');
    } catch (e) {
      console.error(e);
      alert('Failed to start download');
    }
  };

  const handleCancel = async () => {
    if (jobId) {
      await cancelDownload(jobId);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pt-4 pb-12">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div>
          <div className="flex justify-end">
            <Button
              to="/settings"
              className={`p-2 text-slate-400 hover:text-white bg-slate 200 hover:bg-slate-800 rounded-xl transition-colors group`}
              title="Settings"
              id="settingsButton"
            >
              <FiSettings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
            </Button>
          </div>
          <div className="flex items-center justify-center p-2 bg-slate-900/50 rounded-2xl mb-6 shadow-xl backdrop-blur-md">
            <FiMusic className="w-8 h-8 text-purple-400 mr-3" />
            <h3
              id="mainTitle"
              className="text-3xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent tracking-tight"
            >
              Playlist Downloader
            </h3>
          </div>
          <p id="titleDescription" className="text-slate-400 text-lg max-w-xl mx-auto mb-10 text-center">
            Transform any YouTube playlist into high-quality MP3s instantly. Paste the link below to get started.
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <div
              className={`flex gap-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 transition-all duration-300 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20`}
              id="inputPlaylist"
            >
              <PlaylistDropdown
                value={url}
                onChange={setUrl}
                onSelect={(u) => {
                  setUrl(u);
                  fetchPlaylist(u);
                }}
              />
              <Button onClick={handleFetch} disabled={false} className="m-1 w-fit text-nowrap">
                {loading ? 'Fetching...' : 'Fetch Info'}
              </Button>
            </div>
            {defaultUrl && (
              <Button variant="outline" onClick={handleUseDefault} disabled={loading} className=" whitespace-nowrap">
                Use Default
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {playlistData && (
          <motion.div
            key="playlist-info"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            <div className="bg-[#1e293b] text-[#f8fafc] shadow-md border border-[#334155] rounded-xl">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="text-2xl font-semibold leading-none tracking-tight">{playlistData.title}</div>
                <div className={`flex items-center gap-4 text-sm mt-2 ${themeConfig.textMuted}`}>
                  <span className="flex items-center gap-1">
                    <FiFolder /> {playlistData.downloadPath}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock /> {playlistData.totalItems} Items ({playlistData.estimatedSizeMb} MB est.)
                  </span>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-4">
                <div className="space-y-2">
                  <h4 className={`font-semibold text-sm uppercase tracking-wider ${themeConfig.textSecondary}`}>
                    Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`border p-4 rounded-lg flex flex-col items-center justify-center ${themeConfig.dropdownContainer}`}
                    >
                      <span className="text-3xl font-bold text-green-500">{playlistData.existing.length}</span>
                      <span className={`text-sm ${themeConfig.textMuted}`}>Already downloaded</span>
                    </div>
                    <div
                      className={`border p-4 rounded-lg flex flex-col items-center justify-center ${themeConfig.dropdownContainer}`}
                    >
                      <span className={`text-3xl font-bold ${themeConfig.textAccent}`}>
                        {playlistData.missing.length}
                      </span>
                      <span className={`text-sm ${themeConfig.textMuted}`}>Ready to download</span>
                    </div>
                  </div>
                </div>

                {playlistData.missing.length > 0 && (
                  <div className={`mt-6 border ${themeConfig.dropdownContainer} overflow-hidden`}>
                    <div className={`px-4 py-2 text-sm font-semibold border-b ${themeConfig.dropdownHeader}`}>
                      Pending Downloads ({playlistData.missing.length})
                    </div>
                    <ul className={`max-h-64 overflow-y-auto divide-y ${themeConfig.dropdownHeader}`}>
                      {playlistData.missing.map((item) => {
                        const prog = progressData[item.id];
                        return (
                          <li
                            key={item.id}
                            className={`p-4 flex flex-col gap-2 transition-colors ${themeConfig.dropdownItem}`}
                          >
                            <div className="flex justify-between items-center text-sm">
                              <span className={`font-medium line-clamp-1 flex-1 pr-4 ${themeConfig.dropdownTextMain}`}>
                                {item.title}
                              </span>
                              <span
                                className={`text-xs ml-auto whitespace-nowrap capitalize ${prog?.status === 'complete' ? 'text-green-500 font-bold' : prog?.status === 'failed' ? 'text-red-500 font-bold' : themeConfig.textMuted}`}
                              >
                                {prog ? prog.status : 'Pending...'}
                              </span>
                            </div>
                            {prog && <ProgressBar progress={prog.percent} status={prog.status} />}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {playlistData.missing.length > 0 && (
                <div className=" flex items-center p-6 pt-0 bg-[#1e293b] border-t border-[#334155] rounded-b-xl  flex-col sm:flex-row  justify-between gap-4">
                  <div
                    className={`text-sm font-medium w-full sm:w-auto text-center sm:text-left ${themeConfig.textMuted}`}
                  >
                    {jobStatus === 'running' && (
                      <span className={`${themeConfig.textAccent} animate-pulse`}>Downloading...</span>
                    )}
                    {jobStatus === 'completed' && (
                      <span className="text-green-500 flex items-center justify-center sm:justify-start gap-1">
                        <FiCheckCircle /> All Complete!
                      </span>
                    )}
                    {jobStatus === 'error' && (
                      <span className="text-red-500">Finished with some errors. Corrupt files deleted.</span>
                    )}
                    {jobStatus === 'cancelled' && <span className="text-orange-500">Download Cancelled.</span>}
                    {!jobStatus && <span>Ready to start</span>}
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {jobStatus === 'running' ? (
                      <Button variant="destructive" onClick={handleCancel} className="w-full sm:w-auto">
                        Cancel Job
                      </Button>
                    ) : (
                      <Button
                        onClick={handleStartDownload}
                        className="w-full sm:w-auto gap-2"
                        disabled={!!jobStatus && jobStatus !== 'cancelled' && jobStatus !== 'error'}
                      >
                        <FiDownload /> Start Download
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
