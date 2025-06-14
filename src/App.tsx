import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import VA from './components/VA';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-slate-50">
            <Navigation />
            <Hero />
            <About />
            <Services />
            <Portfolio />
            <Contact />
          </div>
        } />
        <Route path="/va" element={<VA />} />
      </Routes>
    </Router>
  );
}

export default App;