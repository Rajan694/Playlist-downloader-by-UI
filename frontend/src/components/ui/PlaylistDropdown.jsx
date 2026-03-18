import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiChevronDown, FiFolder } from 'react-icons/fi';
import { getHistory } from '../../services/api';

export const PlaylistDropdown = ({ value, onChange, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const dropdownRef = useRef(null);

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
          className="peer flex h-12 w-full rounded-md border border-border-main bg-base-bg px-4 py-2 pr-10 text-sm xl:text-base text-text-main placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-main transition-all glass-if-needed"
        />
        <button 
          type="button"
          onClick={() => setOpen(!open)}
          className="absolute right-3 text-text-muted hover:text-text-main p-1 transition-colors"
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
            className="absolute z-10 w-full mt-2 bg-base-surface border border-border-main rounded-md shadow-main overflow-hidden glass-if-needed"
          >
            <div className="p-2 border-b border-border-main text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
              <FiClock /> Recent Playlists
            </div>
            <ul className="max-h-60 overflow-auto">
              {history.map((item) => (
                <li key={item.id}>
                  <button
                    className="w-full text-left px-4 py-3 text-sm hover:bg-base-strong transition-colors flex flex-col gap-1 border-b border-border-main/30 last:border-0"
                    onClick={() => {
                      onSelect(item.url);
                      setOpen(false);
                    }}
                  >
                    <span className="font-medium text-text-main truncate w-full block">{item.title}</span>
                    <span className="text-xs text-text-muted truncate w-full block">{item.url}</span>
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
