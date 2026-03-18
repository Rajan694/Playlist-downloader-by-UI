import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen w-full flex flex-col items-center">
          <Navbar />
          
          <main className="flex-1 w-full px-4 pt-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          
          <footer className="w-full py-6 text-center text-sm text-text-muted border-t border-border-main">
            © {new Date().getFullYear()} Playlist Downloader
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
