import React from 'react';
import FeatureCard from '../components/FeatureCard/FeatureCard';
import './Features.css';

const Features = () => {
  return (
    <div className="features-page">
      <h1>Onsite Features</h1>
      <div className="features-grid">
        <FeatureCard
          icon="🚀"
          title="Rapid Prototyping"
          description="Go from idea to implementation in minutes with our AI-powered code generation"
        />
        <FeatureCard
          icon="🧩"
          title="Component Library"
          description="Access a growing collection of pre-built, customizable components"
        />
        <FeatureCard
          icon="🤖"
          title="AI Assistant"
          description="Get intelligent suggestions and code completions as you work"
        />
      </div>
    </div>
  );
};

export default Features;