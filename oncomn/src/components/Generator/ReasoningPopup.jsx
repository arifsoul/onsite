// oncomn/src/components/Generator/ReasoningPopup.jsx

import React, { useEffect, useRef, useState } from 'react';
import { useCode } from '../../context/CodeContext';
import './ReasoningPopup.css';

const ReasoningPopup = () => {
  const { generatedCode, isLoading } = useCode();
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    // Tampilkan popup saat loading dan ada reasoning
    if (isLoading && generatedCode.reasoning) {
      setIsVisible(true);
    } else {
      // Sembunyikan setelah selesai
      const timer = setTimeout(() => setIsVisible(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, generatedCode.reasoning]);

  useEffect(() => {
    // Auto-scroll ke bawah saat konten baru ditambahkan
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [generatedCode.reasoning]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="reasoning-popup-overlay">
      <div className="reasoning-popup-container">
        <h3>AI Thinking Process...</h3>
        <pre ref={contentRef} className="reasoning-content">
          {generatedCode.reasoning}
        </pre>
      </div>
    </div>
  );
};

export default ReasoningPopup;