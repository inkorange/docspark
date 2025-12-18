import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CSSVariablesProvider } from './contexts/CSSVariablesContext';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import ComponentPage from './pages/ComponentPage';
import './App.scss';

const App: React.FC = () => {
  return (
    <CSSVariablesProvider>
      <Router>
        <div className="app">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/components/:componentName" element={<ComponentPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CSSVariablesProvider>
  );
};

export default App;
