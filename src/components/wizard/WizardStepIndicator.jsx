import React from 'react';

const WizardStepIndicator = ({ totalSteps, currentStep }) => (
  <div style={{ display: 'flex', gap: '15px', marginBottom: '3rem', justifyContent: 'center' }}>
    {Array.from({ length: totalSteps }, (_, i) => i + 1).map(i => (
      <div
        key={i}
        style={{
          width: '50px', height: '50px', borderRadius: '50%',
          backgroundColor: currentStep >= i ? 'var(--primary-color)' : 'var(--border-color)',
          color: currentStep >= i ? 'white' : 'var(--text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: '1.5rem',
          transition: 'all 0.3s',
        }}
      >
        {i}
      </div>
    ))}
  </div>
);

export default WizardStepIndicator;
