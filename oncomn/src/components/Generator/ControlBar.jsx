import React from 'react';
import { FaFolder, FaCode, FaDesktop, FaTabletAlt, FaMobileAlt, FaSave } from 'react-icons/fa';
import { useCode } from '../../context/CodeContext';
import './ControlBar.css';

const ControlBar = ({ onProjectClick, onToggleCodeEditor, viewMode, setViewMode }) => {
  const { saveProject, isLoading } = useCode();

  return (
    <div className="control-bar-container">
      <div className="control-group">
        <button className="control-button" onClick={onProjectClick} disabled={isLoading} title="Open Projects">
          <FaFolder />
          <span>Projects</span>
        </button>
        <button className="control-button" onClick={saveProject} disabled={isLoading} title="Save Project">
          <FaSave />
        </button>
      </div>

      <div className="control-group">
        <button className={`control-button view-button ${viewMode === 'desktop' ? 'active' : ''}`} onClick={() => setViewMode('desktop')} disabled={isLoading} title="Desktop View">
          <FaDesktop />
        </button>
        <button className={`control-button view-button ${viewMode === 'tablet' ? 'active' : ''}`} onClick={() => setViewMode('tablet')} disabled={isLoading} title="Tablet View">
          <FaTabletAlt />
        </button>
        <button className={`control-button view-button ${viewMode === 'mobile' ? 'active' : ''}`} onClick={() => setViewMode('mobile')} disabled={isLoading} title="Mobile View">
          <FaMobileAlt />
        </button>
      </div>
      
      <div className="control-group">
        <button className="control-button" onClick={onToggleCodeEditor} disabled={isLoading} title="Toggle Code Editor">
          <FaCode />
          <span>Show Code</span>
        </button>
      </div>
    </div>
  );
};

export default ControlBar;