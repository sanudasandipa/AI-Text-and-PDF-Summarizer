import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import TextSummarizer from './components/TextSummarizer';
import PDFSummarizer from './components/PDFSummarizer';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar onThemeToggle={handleThemeToggle} darkMode={darkMode} />
      
      <Routes>
        <Route path="/" element={<TextSummarizer darkMode={darkMode} />} />
        <Route path="/pdf" element={<PDFSummarizer darkMode={darkMode} />} />
      </Routes>

      <footer className="footer" id="about">
        <p>Made with ❤️ and Advanced AI Technology By <b>Sanuda</b></p>
      </footer>
    </div>
  );
}

export default App;
