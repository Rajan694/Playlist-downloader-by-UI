import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiChevronDown, FiFolder } from 'react-icons/fi';
import { getHistory } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

export const PlaylistDropdown = ({ value, onChange, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const dropdownRef = useRef(null);
  const { themeConfig } = useTheme();

  useEffect(() => {
    getHistory().then(setHistory).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Paste YouTube playlist URL here..."
          className={`peer flex h-12 w-full px-4 py-2 pr-10 text-sm xl:text-base focus-visible:outline-none focus-visible:ring-2 transition-all ${themeConfig.input}`}
        />
        <button 
          type="button"
          onClick={() => setOpen(!open)}
          className={`absolute right-3 p-1 transition-colors ${themeConfig.textMuted} hover:${themeConfig.textMain}`}
        >
          <FiChevronDown className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute z-10 w-full mt-2 overflow-hidden border ${themeConfig.dropdownContainer}`}
          >
            <div className={`p-2 border-b text-xs font-semibold uppercase tracking-wider flex items-center gap-1 ${themeConfig.dropdownHeader}`}>
              <FiClock /> Recent Playlists
            </div>
            <ul className="max-h-60 overflow-auto">
              {history.map((item) => (
                <li key={item.id}>
                  <button
                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex flex-col gap-1 border-b last:border-0 ${themeConfig.dropdownItem}`}
                    onClick={() => {
                      onSelect(item.url);
                      setOpen(false);
                    }}
                  >
                    <span className={`font-medium truncate w-full block ${themeConfig.dropdownTextMain}`}>{item.title}</span>
                    <span className={`text-xs truncate w-full block ${themeConfig.dropdownTextSub}`}>{item.url}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
