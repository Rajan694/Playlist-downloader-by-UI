import { Link } from 'react-router-dom';
import { FiSettings, FiDownloadCloud } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const { theme } = useTheme();
  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b border-border-main ${theme === 'glassmorphic' ? 'glass border-none' : 'bg-base-surface'}`}
    >
      <div className="container mx-auto max-w-4xl px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-accent-main hover:opacity-80 transition-opacity"
        >
          <FiDownloadCloud className="w-6 h-6" />
          <span>Playlist Downloader</span>
        </Link>
        <Link
          to="/settings"
          className="p-2 rounded-full hover:bg-base-strong transition-colors text-text-secondary hover:text-text-main"
          title="Settings"
        >
          <FiSettings className="w-5 h-5" />
        </Link>
      </div>
    </nav>
  );
};
