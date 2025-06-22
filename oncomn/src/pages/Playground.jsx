import React, { useState } from 'react';
import LivePreview from '../components/Preview/LivePreview';
import CodePreviewPopup from '../components/Generator/CodePreviewPopup';
import ProjectPopup from '../components/Navigation/ProjectPopup';
import BottomBar from '../components/Generator/BottomBar'; // Import the new all-in-one bar
import './Playground.css';
import NavMenu from '../components/Navigation/NavMenu';

const Playground = () => {
  const [isProjectPopupVisible, setProjectPopupVisible] = useState(false);
  const [isCodeEditorVisible, setIsCodeEditorVisible] = useState(false);
  const [viewMode, setViewMode] = useState('desktop');

  return (
    <div className="playground-container">
      <header className="home-header">
        <NavMenu /> 
      </header>
      
      <main className="playground-main">
        <ProjectPopup 
            isVisible={isProjectPopupVisible} 
            toggleVisibility={() => setProjectPopupVisible(false)} 
        />
        
        <LivePreview 
            isEditorVisible={isCodeEditorVisible} 
            viewMode={viewMode}
        />
        
        <BottomBar 
            onProjectClick={() => setProjectPopupVisible(true)}
            onToggleCodeEditor={() => setIsCodeEditorVisible(!isCodeEditorVisible)}
            viewMode={viewMode}
            setViewMode={setViewMode}
            isCodeEditorVisible={isCodeEditorVisible}
        />
        
        <CodePreviewPopup />
      </main>
    </div>
  );
};

export default Playground;