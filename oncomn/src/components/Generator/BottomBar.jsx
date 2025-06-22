import React from 'react';
import { FaFolder, FaCode, FaDesktop, FaTabletAlt, FaMobileAlt } from 'react-icons/fa';
import AIGenerator from './AIGenerator'; // The prompt input component
import './BottomBar.css';

const BottomBar = ({ 
  onProjectClick, 
  onToggleCodeEditor, 
  viewMode, 
  setViewMode,
  isCodeEditorVisible 
}) => {
  return (
    <div className="bottom-bar-wrapper">
      <div className="bottom-bar-container">
        {/* Top row for control buttons */}
        <div className="control-bar">
          <div className="control-group left">
            <button className="control-button" onClick={onProjectClick} title="Open Projects">
              <FaFolder />
              <span>Projects</span>
            </button>
          </div>
          <div className="control-group center">
            <button className={`control-button view-button ${viewMode === 'desktop' ? 'active' : ''}`} onClick={() => setViewMode('desktop')} title="Desktop View">
              <FaDesktop />
            </button>
            <button className={`control-button view-button ${viewMode === 'tablet' ? 'active' : ''}`} onClick={() => setViewMode('tablet')} title="Tablet View">
              <FaTabletAlt />
            </button>
            <button className={`control-button view-button ${viewMode === 'mobile' ? 'active' : ''}`} onClick={() => setViewMode('mobile')} title="Mobile View">
              <FaMobileAlt />
            </button>
          </div>
          <div className="control-group right">
            <button className={`control-button ${isCodeEditorVisible ? 'active' : ''}`} onClick={onToggleCodeEditor} title="Toggle Code Editor">
              <FaCode />
              <span>Code</span>
            </button>
          </div>
        </div>
        
        {/* Bottom row for the AI prompt */}
        <AIGenerator />
      </div>
    </div>
  );
};

export default BottomBar;