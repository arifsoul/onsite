// oncomn/src/components/Preview/DraggableHandle.jsx

import React, { useCallback, useRef } from 'react';

const DraggableHandle = ({ onResize }) => {
  const handleRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = handleRef.current.parentElement.querySelector('.code-editor-container').offsetHeight;

    const handleMouseMove = (moveEvent) => {
      const newHeight = startHeight - (moveEvent.clientY - startY);
      onResize(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onResize]);

  return (
    <div
      ref={handleRef}
      onMouseDown={handleMouseDown}
      style={{
        width: '100%',
        height: '10px',
        cursor: 'ns-resize',
        backgroundColor: '#444',
        borderTop: '1px solid #555',
        borderBottom: '1px solid #555',
        flexShrink: 0
      }}
    />
  );
};

export default DraggableHandle;