import React from 'react';
import { useI18n } from '../../../i18n';
import { doctors, specialties } from '../../../data/doctors';

const Step1Doctor = ({ formData, errors, handleChange, showCursor, onSpecialtyChange }) => {
  const { t } = useI18n();

  return (
    <div className="fade-in">
      <h2>{t('step1Title')}</h2>

      <div className="form-group">
        {showCursor('specialty') && <div className="guide-cursor">👆</div>}
        <label htmlFor="specialty">{t('specialtyLabel')}</label>
        <select
          id="specialty"
          name="specialty"
          value={formData.specialty}
          onChange={onSpecialtyChange}
          className={errors.specialty ? 'error' : ''}
          aria-invalid={!!errors.specialty}
        >
          <option value="">{t('specialtyPlaceholder')}</option>
          {specialties.map(spec => (
            <option key={spec} value={spec}>{t(spec)}</option>
          ))}
        </select>
        {errors.specialty && <div className="error-message">⚠️ {errors.specialty}</div>}
      </div>

      {formData.specialty && (
        <div className="form-group fade-in">
          {showCursor('doctorId') && <div className="guide-cursor">👆</div>}
          <label htmlFor="doctorId">{t('doctorLabel')}</label>
          <select
            id="doctorId"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            className={errors.doctorId ? 'error' : ''}
            aria-invalid={!!errors.doctorId}
          >
            <option value="">{t('doctorPlaceholder')}</option>
            {doctors.filter(doc => doc.specialty === formData.specialty).map(doc => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))}
          </select>
          {errors.doctorId && <div className="error-message">⚠️ {errors.doctorId}</div>}
        </div>
      )}

    </div>
  );
};

export default Step1Doctor;
