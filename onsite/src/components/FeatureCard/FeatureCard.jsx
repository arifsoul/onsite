import React from 'react';
import PropTypes from 'prop-types';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <li className="feature-card">
      <div className="feature-icon-wrapper">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </li>
  );
};

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default FeatureCard;