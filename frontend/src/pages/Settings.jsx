import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';
import { getSettings, updateSettings, getDefaultDownloadPath } from '../services/api';
import { FiSave, FiFolder, FiMonitor, FiMusic } from 'react-icons/fi';

const THEME_OPTIONS = [
  { id: 'normal', label: 'Light (Normal)' },
  { id: 'dark', label: 'Dark Mode' },
  { id: 'vintage', label: 'Vintage / Sepia' },
  { id: 'glassmorphic', label: 'Glassmorphic' }
];

export const Settings = () => {
  const { theme, changeTheme } = useTheme();
  const [formData, setFormData] = useState({
    defaultPlaylistUrl: '',
    downloadPath: '',
    downloadConfig: { audioQuality: 0, wantLyrics: true }
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    getSettings().then(s => setFormData(s));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
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

  const handleUseSystemDefault = async () => {
    try {
      const p = await getDefaultDownloadPath();
      setFormData(prev => ({ ...prev, downloadPath: p }));
    } catch {
      alert("Failed to fetch system path");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto pt-4 pb-12"
    >
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <p className="text-sm text-text-muted">Configure default paths, theme, and audio quality.</p>
        </CardHeader>

        <form onSubmit={handleSave}>
          <CardContent className="space-y-6">
            
            {/* Download Settings */}
            <div className="space-y-4 border-b border-border-main pb-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-primary flex items-center gap-2">
                <FiFolder /> Download Preferences
              </h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Download Folder</label>
                <div className="flex gap-2">
                  <Input 
                    required
                    value={formData.downloadPath}
                    onChange={(e) => setFormData({...formData, downloadPath: e.target.value})}
                    placeholder="/home/user/Downloads"
                  />
                  <Button type="button" variant="outline" onClick={handleUseSystemDefault}>Set to OS Default</Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Default Playlist URL (Optional)</label>
                <Input 
                  value={formData.defaultPlaylistUrl}
                  onChange={(e) => setFormData({...formData, defaultPlaylistUrl: e.target.value})}
                  placeholder="https://youtube.com/playlist?list=..."
                />
              </div>
            </div>

            {/* Audio Config */}
            <div className="space-y-4 border-b border-border-main pb-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-primary flex items-center gap-2">
                <FiMusic /> Audio Quality & Lyrics
              </h4>
              
              <div className="space-y-2">
                <label className="flex items-center justify-between text-sm font-medium">
                  <span>Audio Quality (yt-dlp)</span>
                  <span className="text-accent-main font-bold block">{formData.downloadConfig.audioQuality === 0 ? "0 (Best)" : `${formData.downloadConfig.audioQuality} (Worst)`}</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="10" step="1"
                  value={formData.downloadConfig.audioQuality}
                  onChange={(e) => setFormData({...formData, downloadConfig: { ...formData.downloadConfig, audioQuality: parseInt(e.target.value) }})}
                  className="w-full accent-accent-main"
                />
                <p className="text-xs text-text-muted text-right">0 = Highest quality bit rate, 10 = Lowest file size</p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-md border border-border-main hover:bg-base-surface transition-colors">
                <input 
                  type="checkbox" 
                  checked={formData.downloadConfig.wantLyrics}
                  onChange={(e) => setFormData({...formData, downloadConfig: { ...formData.downloadConfig, wantLyrics: e.target.checked }})}
                  className="w-5 h-5 rounded border-border-main text-accent-main focus:ring-accent-main accent-accent-main"
                />
                <div>
                  <div className="font-medium text-sm">Download Lyrics</div>
                  <div className="text-xs text-text-muted">Attempts to embed Genius lyrics automatically into MP3 tags.</div>
                </div>
              </label>
            </div>

            {/* Theme UI */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-primary flex items-center gap-2">
                <FiMonitor /> Appearance
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                {THEME_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => changeTheme(opt.id)}
                    className={`p-3 rounded-lg border text-sm text-left transition-all ${
                      theme === opt.id 
                        ? 'border-accent-main ring-2 ring-accent-main shadow-md bg-base-surface font-semibold text-accent-main' 
                        : 'border-border-main hover:border-accent-hover bg-base-bg text-text-main'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-muted">Clicking a theme applies it instantly across the whole app.</p>
            </div>

          </CardContent>
          <CardFooter className="flex items-center justify-between bg-base-surface/50 rounded-b-xl border-t border-border-main pt-6">
            <span className="text-green-500 text-sm font-semibold">
              {successMsg}
            </span>
            <Button type="submit" disabled={saving} className="gap-2">
              <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};
