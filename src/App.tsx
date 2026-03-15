import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ProjectsManager from './components/ProjectsManager';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(d => !d)} />
              <HomePage />
              <Footer />
            </>
          }
        />
        <Route path="/admin/projects" element={<ProjectsManager />} />
      </Routes>
    </div>
  );
}

export default App;
