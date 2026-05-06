import React from 'react';
import { useI18n } from '../../../i18n';

const Step3PatientInfo = ({ formData, errors, handleChange, showCursor }) => {
  const { t } = useI18n();

  return (
    <div className="fade-in">
      <h2>{t('step3Title')}</h2>

      <div className="form-group">
        {showCursor('firstName') && <div className="guide-cursor">👆</div>}
        <label htmlFor="firstName">{t('firstNameLabel')}</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={errors.firstName ? 'error' : ''}
          aria-invalid={!!errors.firstName}
        />
        {errors.firstName && <div className="error-message">⚠️ {errors.firstName}</div>}
      </div>

      <div className="form-group">
        {showCursor('lastName') && <div className="guide-cursor">👆</div>}
        <label htmlFor="lastName">{t('lastNameLabel')}</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={errors.lastName ? 'error' : ''}
          aria-invalid={!!errors.lastName}
        />
        {errors.lastName && <div className="error-message">⚠️ {errors.lastName}</div>}
      </div>

      <div className="form-group">
        {showCursor('phone') && <div className="guide-cursor">👆</div>}
        <label htmlFor="phone">{t('phoneLabel')}</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={errors.phone ? 'error' : ''}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && <div className="error-message">⚠️ {errors.phone}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="email">{t('emailLabel')}</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          aria-invalid={!!errors.email}
        />
        {errors.email && <div className="error-message">⚠️ {errors.email}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="address">{t('addressLabel')}</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">{t('notesLabel')}</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid var(--border-color)', fontSize: '1.2rem', fontFamily: 'inherit' }}
        />
      </div>

      <div className="info-banner" style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#e8f4fd', borderRadius: '8px', color: '#0056b3', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>{t('bankDisclaimer')}</span>
      </div>
    </div>
  );
};

export default Step3PatientInfo;
