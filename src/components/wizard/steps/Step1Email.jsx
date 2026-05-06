import React from 'react';
import { useI18n } from '../../../i18n';

const Step1Email = ({ formData, errors, handleChange, showCursor }) => {
  const { t } = useI18n();

  return (
    <div className="fade-in">
      <h2>{t('emailStepTitle')}</h2>
      
      <div className="form-group" style={{ marginTop: '2rem' }}>
        {showCursor('email') && <div className="guide-cursor">👆</div>}
        <label htmlFor="email" style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'block' }}>
          {t('emailLabel')}
        </label>
        <input 
          type="email" 
          id="email"
          name="email" 
          value={formData.email} 
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          aria-invalid={!!errors.email}
          placeholder={t('emailPlaceholder')}
          style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}
          autoFocus
        />
        {errors.email && <div className="error-message">⚠️ {errors.email}</div>}
      </div>

      <div className="info-banner" style={{ marginTop: '2rem' }}>
        {t('bankDisclaimer')}
      </div>
    </div>
  );
};

export default Step1Email;
