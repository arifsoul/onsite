// oncomn/src/pages/Playground.jsx

import React from 'react';
import AIGenerator from '../components/Generator/AIGenerator';
import LivePreview from '../components/Preview/LivePreview';
import NavMenu from '../components/Navigation/NavMenu';
import './Playground.css'; // Gunakan file CSS yang baru

const Playground = () => {
  return (
    // Gunakan class container yang baru
    <div className="playground-container"> 
      <header className="home-header">
        <NavMenu />
      </header>
      {/* Gunakan class main yang baru */}
      <main className="playground-main"> 
        <LivePreview />
        <AIGenerator />
      </main>
    </div>
  );
};

export default Playground;