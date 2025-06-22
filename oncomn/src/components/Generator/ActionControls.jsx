import React from 'react';
import { FaFolder, FaCode } from 'react-icons/fa';
import './ActionControls.css';

const ActionControls = ({ onProjectClick, onToggleCodeEditor }) => {
  return (
    <div className="action-controls-container">
      <button className="action-button" onClick={onProjectClick}>
        <FaFolder />
        <span>Proyek</span>
      </button>
      <button className="action-button" onClick={onToggleCodeEditor}>
        <FaCode />
        <span>Show Code</span>
      </button>
    </div>
  );
};

export default ActionControls;