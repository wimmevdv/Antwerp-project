import React, { useState } from 'react';
import { useI18n } from '../i18n';
import emailjs from '@emailjs/browser';

const doctors = [
  { id: '1', name: 'Dr. Janssens', specialty: 'spec_cardiology' },
  { id: '2', name: 'Dr. Peeters', specialty: 'spec_orthopedics' },
  { id: '3', name: 'Dr. Dubois', specialty: 'spec_pediatrics' },
  { id: '4', name: 'Dr. Mertens', specialty: 'spec_ophthalmology' },
];

const Wizard = ({ onReset }) => {
  const { t, lang } = useI18n();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [guideMode, setGuideMode] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  
  // Form State
  const [formData, setFormData] = useState({
    specialty: '',
    doctorId: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
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
    if (!formData.date || !formData.time) {
      newErrors.date = t('errorRequired');
      newErrors.time = t('errorRequired');
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  // Weekly Calendar Logic
  const generateWeekDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const currentDayOfWeek = today.getDay();
    const distanceToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - distanceToMonday + (currentWeekOffset * 7));

    for (let i = 0; i < 5; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const handleTimeSlotSelect = (dateStr, timeStr) => {
    setFormData(prev => ({ ...prev, date: dateStr, time: timeStr }));
    if (errors.date || errors.time) {
      setErrors(prev => ({ ...prev, date: null, time: null }));
    }
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = t('errorRequired');
    else if (!formData.lastName) newErrors.lastName = t('errorRequired');
    else if (!formData.phone) {
      newErrors.phone = t('errorRequired');
    } else if (formData.phone.length < 8) {
      newErrors.phone = t('errorPhone');
    } else if (!formData.email) {
      newErrors.email = t('errorRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('errorEmail');
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
      
      const templateParams = {
        to_email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        date: formData.date,
        time: formData.time,
      };

      emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams, "YOUR_PUBLIC_KEY")
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
          setIsSuccess(true);
        })
        .catch((err) => {
          console.error('FAILED...', err);
          setIsSuccess(true);
        });
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
      if (!formData.date || !formData.time) return fieldName === 'timeSlot';
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
          
          <div className="calendar-header">
            <button 
              className="secondary" 
              onClick={() => setCurrentWeekOffset(prev => prev - 1)}
              disabled={currentWeekOffset <= 0}
            >
              &lt; {t('prevWeek')}
            </button>
            <h3>{t('weekOf')} {generateWeekDays()[0].toLocaleDateString(lang, { day: 'numeric', month: 'long' })}</h3>
            <button 
              className="secondary" 
              onClick={() => setCurrentWeekOffset(prev => prev + 1)}
            >
              {t('nextWeek')} &gt;
            </button>
          </div>

          <div className="calendar-grid">
            {generateWeekDays().map((date, idx) => {
              const dateStr = date.toISOString().split('T')[0];
              const isToday = new Date().toISOString().split('T')[0] === dateStr;
              const isPastDate = date < new Date(new Date().setHours(0,0,0,0));
              
              let showFirstCursor = false;
              if (showCursor('timeSlot') && !formData.time) {
                 // The logic for the cursor can just be placed on the grid itself, or we skip complex cursor logic for the calendar grid
                 // We will just show the cursor on the nextBtn if selected, otherwise maybe just a generic place.
              }

              return (
                <div key={dateStr} className="calendar-day">
                  <div className="calendar-day-header">
                    <strong>{date.toLocaleDateString(lang, { weekday: 'long' })}</strong>
                    <span>{date.getDate()}</span>
                  </div>
                  <div className="calendar-slots">
                    {isPastDate ? (
                      <div style={{textAlign: 'center', padding: '1rem', color: '#a0a0a0'}}>-</div>
                    ) : (
                      ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30'].map((timeSlot, tIdx) => {
                        const booked = JSON.parse(localStorage.getItem('bookedSlots') || '[]');
                        const isBooked = booked.some(b => b.doctorId === formData.doctorId && b.date === dateStr && b.time === timeSlot);
                        const isSelected = formData.date === dateStr && formData.time === timeSlot;
                        
                        let isPastTime = false;
                        if (isToday) {
                          const [h, m] = timeSlot.split(':');
                          const slotTime = new Date();
                          slotTime.setHours(parseInt(h), parseInt(m), 0, 0);
                          isPastTime = slotTime < new Date();
                        }
                        
                        const isDisabled = isBooked || isPastTime;
                        
                        return (
                          <div style={{ position: 'relative' }} key={timeSlot}>
                            {showCursor('timeSlot') && !isDisabled && !formData.time && !showFirstCursor && (() => { showFirstCursor = true; return <div className="guide-cursor" style={{right: '-20px', top: '0px', zIndex: 100, fontSize: '3rem'}}>👆</div>; })()}
                            <button
                              className={`time-slot ${isSelected ? 'selected' : ''}`}
                              disabled={isDisabled}
                              onClick={() => handleTimeSlotSelect(dateStr, timeSlot)}
                            >
                              {timeSlot}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {(errors.date || errors.time) && <div className="error-message" style={{marginTop: '1rem'}}>⚠️ {t('errorRequired')}</div>}
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
