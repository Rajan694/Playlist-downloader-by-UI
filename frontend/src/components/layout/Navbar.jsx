import { Link } from 'react-router-dom';
import { FiSettings, FiDownloadCloud } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const { themeConfig } = useTheme();
  return (
    <nav
      className={themeConfig.navbar}
    >
      <div className="container mx-auto max-w-4xl px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className={`flex items-center gap-2 text-xl font-bold tracking-tight ${themeConfig.navbarLogo}`}
        >
          <FiDownloadCloud className="w-6 h-6" />
          <span>Playlist Downloader</span>
        </Link>
        <Link
          to="/settings"
          className={`p-2 rounded-full transition-colors ${themeConfig.navbarIconHover}`}
          title="Settings"
        >
          <FiSettings className="w-5 h-5" />
        </Link>
      </div>
    </nav>
  );
};
