import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';
import { getSettings, updateSettings, getDefaultDownloadPath, validateDownloadPath } from '../services/api';
import { FiSave, FiFolder, FiMonitor, FiMusic } from 'react-icons/fi';
import { cn } from '../utils/cn';

const THEME_OPTIONS = [{ id: 'dark', label: 'Dark Mode' }];

export const Settings = () => {
  const { theme, changeTheme, themeConfig } = useTheme();
  const [formData, setFormData] = useState({
    defaultPlaylistUrl: '',
    downloadPath: '',
    downloadConfig: { audioQuality: 0, wantLyrics: true },
  });
  const [downloadPathError, setDownloadPathError] = useState('');
  const [validatingPath, setValidatingPath] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    getSettings().then((s) => setFormData(s));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    // Validate download path before saving settings
    if (formData.downloadPath) {
      const ok = await handleValidateDownloadPath(formData.downloadPath, { silent: false });
      if (!ok) {
        return;
      }
    }

    setSaving(true);
    setSuccessMsg('');
    try {
      await updateSettings(formData);
      setSuccessMsg('Settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleValidateDownloadPath = async (path, { silent = true } = {}) => {
    if (!path) {
      setDownloadPathError('Download folder is required');
      return false;
    }

    try {
      setValidatingPath(true);
      const result = await validateDownloadPath(path);
      if (result.valid) {
        setDownloadPathError('');
        return true;
      }

      const message = result.reason || 'Selected path is not a valid directory';
      setDownloadPathError(message);

      if (!silent) {
        // Optional surface via alert in addition to inline text
        console.warn('Download path validation failed:', message);
      }

      return false;
    } catch (err) {
      console.error('Failed to validate download path', err);
      if (!silent) {
        alert('Failed to validate download folder. Please try again.');
      }
      if (!downloadPathError) {
        setDownloadPathError('Could not validate folder');
      }
      return false;
    } finally {
      setValidatingPath(false);
    }
  };

  const handleUseSystemDefault = async () => {
    try {
      const p = await getDefaultDownloadPath();
      setFormData((prev) => ({ ...prev, downloadPath: p }));
    } catch {
      alert('Failed to fetch system path');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto pt-4 pb-12"
    >
      <div className="bg-[#1e293b] text-[#f8fafc] shadow-md border border-[#334155] rounded-xl">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="text-2xl font-semibold leading-none tracking-tight">Application Settings</div>
          <p className={`text-sm ${themeConfig.textMuted}`}>Configure default paths, theme, and audio quality.</p>
        </div>

        <form onSubmit={handleSave}>
          <div className="p-6 pt-0 space-y-6">
            {/* Download Settings */}
            <div className={`space-y-4 border-b ${themeConfig.dropdownHeader} pb-6`}>
              <h4
                className={`text-sm font-semibold uppercase tracking-wider ${themeConfig.dropdownTextMain} flex items-center gap-2`}
              >
                <FiFolder /> Download Preferences
              </h4>

              <div className="space-y-2">
                <label className="text-sm font-medium">Default Download Folder</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.downloadPath}
                    className={cn(
                      'flex h-10 w-full px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                      themeConfig.input,
                    )}
                    onChange={(e) => {
                      setFormData({ ...formData, downloadPath: e.target.value });
                      // Clear previous error as user edits; will re-validate on blur/save
                      if (downloadPathError) setDownloadPathError('');
                    }}
                    onBlur={(e) => handleValidateDownloadPath(e.target.value)}
                    placeholder="/home/user/Downloads"
                  />
                  <Button type="button" variant="outline" onClick={handleUseSystemDefault}>
                    Set to OS Default
                  </Button>
                </div>
                {downloadPathError && <p className="text-xs text-red-500 mt-1">{downloadPathError}</p>}
                {validatingPath && <p className={`text-xs ${themeConfig.textMuted}`}>Validating folder…</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Default Playlist URL (Optional)</label>
                <input
                  type="text"
                  className={cn(
                    'flex h-10 w-full px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    themeConfig.input,
                  )}
                  value={formData.defaultPlaylistUrl}
                  onChange={(e) => setFormData({ ...formData, defaultPlaylistUrl: e.target.value })}
                  placeholder="https://youtube.com/playlist?list=..."
                />
              </div>
            </div>

            {/* Audio Config */}
            <div className={`space-y-4 border-b ${themeConfig.dropdownHeader} pb-6`}>
              <h4
                className={`text-sm font-semibold uppercase tracking-wider ${themeConfig.dropdownTextMain} flex items-center gap-2`}
              >
                <FiMusic /> Audio Quality & Lyrics
              </h4>

              <div className="space-y-2">
                <label className="flex items-center justify-between text-sm font-medium">
                  <span>Audio Quality (yt-dlp)</span>
                  <span className={`${themeConfig.textAccent} font-bold block`}>
                    {formData.downloadConfig.audioQuality === 10
                      ? '10(Best)'
                      : `${formData.downloadConfig.audioQuality}`}
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.downloadConfig.audioQuality}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      downloadConfig: { ...formData.downloadConfig, audioQuality: parseInt(e.target.value) },
                    })
                  }
                  className="w-full"
                />
                <p className={`text-xs ${themeConfig.textMuted} text-right`}>
                  10 = Highest quality bit rate, 0 = Lowest file size
                </p>
              </div>

              <label
                className={`flex items-center gap-3 cursor-pointer p-3 rounded-md border ${themeConfig.dropdownItem} transition-colors`}
              >
                <input
                  type="checkbox"
                  checked={formData.downloadConfig.wantLyrics}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      downloadConfig: { ...formData.downloadConfig, wantLyrics: e.target.checked },
                    })
                  }
                  className="w-5 h-5 rounded"
                />
                <div>
                  <div className="font-medium text-sm">Download Lyrics</div>
                  <div className={`text-xs ${themeConfig.textMuted}`}>
                    Attempts to embed Genius lyrics automatically into MP3 tags.
                  </div>
                </div>
              </label>
            </div>

            {/* Theme UI */}
            <div className="space-y-4">
              <h4
                className={`text-sm font-semibold uppercase tracking-wider ${themeConfig.dropdownTextMain} flex items-center gap-2`}
              >
                <FiMonitor /> Appearance
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => changeTheme(opt.id)}
                    className={`p-3 rounded-lg border text-sm text-left transition-all ${
                      theme === opt.id
                        ? `ring-2 shadow-md font-semibold ${themeConfig.dropdownItem} ${themeConfig.textAccent} border-current`
                        : `${themeConfig.dropdownContainer} opacity-80 border-transparent`
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className={`text-xs ${themeConfig.textMuted}`}>
                Clicking a theme applies it instantly across the whole app.
              </p>
            </div>
          </div>
          <div className=" p-6  bg-[#1e293b]  border-[#334155] flex items-center justify-between rounded-b-xl border-t pt-6">
            <span className="text-green-500 text-sm font-semibold">{successMsg}</span>
            <Button type="submit" disabled={saving} className="gap-2">
              <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
