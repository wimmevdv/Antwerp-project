import React, { useState } from 'react';
import { useI18n } from '../i18n';

const doctors = [
  { id: '1', name: 'Dr. Janssens', specialty: 'spec_cardiology' },
  { id: '2', name: 'Dr. Peeters', specialty: 'spec_orthopedics' },
  { id: '3', name: 'Dr. Dubois', specialty: 'spec_pediatrics' },
  { id: '4', name: 'Dr. Mertens', specialty: 'spec_ophthalmology' },
];

const Wizard = ({ onReset }) => {
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [guideMode, setGuideMode] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    specialty: '',
    doctorId: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  // Errors State
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    let isValid = true;
    const newErrors = {};
    if (!formData.specialty) {
      newErrors.specialty = t('errorRequired');
      isValid = false;
    } else if (!formData.doctorId) {
      newErrors.doctorId = t('errorRequired');
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = t('errorRequired');
    else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (selectedDate < today) newErrors.date = t('errorDate');
    }
    
    // Only check time if date is valid so we don't overwhelm with errors
    if (!newErrors.date && !formData.time) {
       newErrors.time = t('errorRequired');
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = t('errorRequired');
    else if (!formData.lastName) newErrors.lastName = t('errorRequired');
    else if (!formData.phone) {
      newErrors.phone = t('errorRequired');
    } else if (formData.phone.length < 8) {
      newErrors.phone = t('errorPhone');
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    if (step === 2) isValid = validateStep2();
    
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (validateStep3()) {
      const bookedSlots = JSON.parse(localStorage.getItem('bookedSlots') || '[]');
      bookedSlots.push({
        doctorId: formData.doctorId,
        date: formData.date,
        time: formData.time,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));
      setIsSuccess(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const showCursor = (fieldName) => {
    if (!guideMode) return false;
    
    // Prioritize errors
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      return errorKeys[0] === fieldName;
    }
    
    // Next logical step
    if (step === 1) {
      if (!formData.specialty) return fieldName === 'specialty';
      if (!formData.doctorId) return fieldName === 'doctorId';
      return fieldName === 'nextBtn';
    }
    if (step === 2) {
      if (!formData.date) return fieldName === 'date';
      if (!formData.time) return fieldName === 'time';
      return fieldName === 'nextBtn';
    }
    if (step === 3) {
      if (!formData.firstName) return fieldName === 'firstName';
      if (!formData.lastName) return fieldName === 'lastName';
      if (!formData.phone) return fieldName === 'phone';
      return fieldName === 'submitBtn';
    }
    return false;
  };

  if (isSuccess) {
    return (
      <div className="card fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ fontSize: '2.5rem' }}>{t('successTitle')}</h2>
        <p style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>{t('successMessage')}</p>
        <button 
          className="primary" 
          style={{ marginTop: '3rem', fontSize: '1.5rem', padding: '20px 40px' }}
          onClick={onReset}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="card fade-in">
      <button 
        className="guide-toggle" 
        onClick={() => setGuideMode(!guideMode)}
      >
        {guideMode ? '🛑 ' + t('guideDisable') : '✨ ' + t('guideEnable')}
      </button>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '3rem', justifyContent: 'center' }}>
        {[1, 2, 3].map(i => (
          <div 
            key={i}
            style={{
              width: '50px', height: '50px', borderRadius: '50%',
              backgroundColor: step >= i ? 'var(--primary-color)' : 'var(--border-color)',
              color: step >= i ? 'white' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', fontSize: '1.5rem',
              transition: 'all 0.3s'
            }}
          >
            {i}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="fade-in">
          <h2>{t('step1Title')}</h2>
          <div className="form-group">
            {showCursor('specialty') && <div className="guide-cursor">👆</div>}
            <label htmlFor="specialty">{t('specialtyLabel')}</label>
            <select 
              id="specialty"
              name="specialty" 
              value={formData.specialty} 
              onChange={(e) => {
                handleChange(e);
                setFormData(prev => ({ ...prev, doctorId: '' }));
              }}
              className={errors.specialty ? 'error' : ''}
              aria-invalid={!!errors.specialty}
            >
              <option value="">{t('specialtyPlaceholder')}</option>
              {['spec_cardiology', 'spec_orthopedics', 'spec_pediatrics', 'spec_ophthalmology'].map(spec => (
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
      )}

      {step === 2 && (
        <div className="fade-in">
          <h2>{t('step2Title')}</h2>
          <div className="form-group">
            {showCursor('date') && <div className="guide-cursor">👆</div>}
            <label htmlFor="date">{t('dateLabel')}</label>
            <input 
              type="date" 
              id="date"
              name="date" 
              value={formData.date} 
              onChange={handleChange}
              className={errors.date ? 'error' : ''}
              aria-invalid={!!errors.date}
            />
            {errors.date && <div className="error-message">⚠️ {errors.date}</div>}
          </div>
          
          {formData.date && (
            <div className="form-group fade-in">
              {showCursor('time') && <div className="guide-cursor">👆</div>}
              <label htmlFor="time">{t('timeLabel')}</label>
              <select 
                id="time"
                name="time" 
                value={formData.time} 
                onChange={handleChange}
                className={errors.time ? 'error' : ''}
                aria-invalid={!!errors.time}
              >
                <option value="">{t('timePlaceholder')}</option>
                {['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30']
                  .filter(timeSlot => {
                    const booked = JSON.parse(localStorage.getItem('bookedSlots') || '[]');
                    return !booked.some(b => b.doctorId === formData.doctorId && b.date === formData.date && b.time === timeSlot);
                  })
                  .map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.time && <div className="error-message">⚠️ {errors.time}</div>}
            </div>
          )}
        </div>
      )}

      {step === 3 && (
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
            />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
        {step > 1 ? (
          <button className="secondary" onClick={handleBack}>{t('backButton')}</button>
        ) : <div />}
        
        {step < 3 ? (
          <div style={{position: 'relative'}}>
            {showCursor('nextBtn') && <div className="guide-cursor" style={{right: '40px', top: '-15px'}}>👆</div>}
            <button className="primary" onClick={handleNext}>{t('nextButton')}</button>
          </div>
        ) : (
          <div style={{position: 'relative'}}>
            {showCursor('submitBtn') && <div className="guide-cursor" style={{right: '40px', top: '-15px'}}>👆</div>}
            <button className="primary" onClick={handleSubmit}>{t('submitButton')}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wizard;
