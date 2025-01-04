// components/ProgressBar.js

import React from 'react';

const ProgressBar = ({ currentStep }) => {
  const steps = ['Signup', 'Role Selection', 'Photographer Details', 'Completion'];

  return (
    <div className="progress-bar">
      {steps.map((step, index) => (
        <div key={index} className="step-container">
          <div
            className={`step-circle ${
              currentStep > index ? 'completed' : currentStep === index ? 'active' : ''
            }`}
          >
            {index + 1}
          </div>
          <div className="step-label">{step}</div>
          {index < steps.length - 1 && <div className="step-line"></div>}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;