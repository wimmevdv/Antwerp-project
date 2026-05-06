import React, { useState } from 'react';
import { useI18n } from '../i18n';
import emailjs from '@emailjs/browser';

const doctors = [
  { id: '1', name: 'Dr. Janssens', specialty: 'spec_cardiology' },
  { id: '2', name: 'Dr. Peeters', specialty: 'spec_orthopedics' },
  { id: '3', name: 'Dr. Dubois', specialty: 'spec_pediatrics' },
  { id: '4', name: 'Dr. Mertens', specialty: 'spec_ophthalmology' },
];

const questionnaires = {
  spec_cardiology: [
    { id: 'chest_pain', questionKey: 'q_cardio_chest_pain', options: ['opt_yes', 'opt_no', 'opt_sometimes'] },
    { id: 'shortness_breath', questionKey: 'q_cardio_shortness_breath', options: ['opt_yes', 'opt_no', 'opt_sometimes'] },
    { id: 'palpitations', questionKey: 'q_cardio_palpitations', options: ['opt_yes', 'opt_no', 'opt_sometimes'] },
    { id: 'family_history', questionKey: 'q_cardio_family_history', options: ['opt_yes', 'opt_no', 'opt_unknown'] },
    { id: 'blood_pressure', questionKey: 'q_cardio_blood_pressure', options: ['opt_yes', 'opt_no', 'opt_unknown'] },
  ],
  spec_orthopedics: [
    { id: 'pain_location', questionKey: 'q_ortho_pain_location', options: ['opt_shoulder', 'opt_knee', 'opt_hip', 'opt_back', 'opt_other'] },
    { id: 'pain_duration', questionKey: 'q_ortho_pain_duration', options: ['opt_less_week', 'opt_one_month', 'opt_several_months', 'opt_more_year'] },
    { id: 'accident', questionKey: 'q_ortho_accident', options: ['opt_yes', 'opt_no'] },
    { id: 'daily_limit', questionKey: 'q_ortho_daily_limit', options: ['opt_yes', 'opt_no', 'opt_sometimes'] },
    { id: 'previous_surgery', questionKey: 'q_ortho_previous_surgery', options: ['opt_yes', 'opt_no'] },
  ],
  spec_pediatrics: [
    { id: 'child_age', questionKey: 'q_peds_child_age', options: ['opt_age_0_2', 'opt_age_3_6', 'opt_age_7_12', 'opt_age_13_18'] },
    { id: 'fever', questionKey: 'q_peds_fever', options: ['opt_yes', 'opt_no'] },
    { id: 'symptoms_duration', questionKey: 'q_peds_symptoms_duration', options: ['opt_less_2days', 'opt_2_7days', 'opt_more_week'] },
    { id: 'allergies', questionKey: 'q_peds_allergies', options: ['opt_yes', 'opt_no', 'opt_unknown'] },
    { id: 'vaccinations', questionKey: 'q_peds_vaccinations', options: ['opt_complete', 'opt_partial', 'opt_no'] },
  ],
  spec_ophthalmology: [
    { id: 'blurry_vision', questionKey: 'q_opht_blurry_vision', options: ['opt_yes', 'opt_no', 'opt_sometimes'] },
    { id: 'spots_flashes', questionKey: 'q_opht_spots_flashes', options: ['opt_yes', 'opt_no', 'opt_sometimes'] },
    { id: 'glasses', questionKey: 'q_opht_glasses', options: ['opt_glasses', 'opt_lenses', 'opt_no'] },
    { id: 'dry_eyes', questionKey: 'q_opht_dry_eyes', options: ['opt_yes', 'opt_no', 'opt_sometimes'] },
    { id: 'family_eye', questionKey: 'q_opht_family_eye', options: ['opt_yes', 'opt_no', 'opt_unknown'] },
  ],
};

const Wizard = ({ onReset }) => {
  const { t, lang } = useI18n();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [guideMode, setGuideMode] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

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

  const [questionnaireAnswers, setQuestionnaireAnswers] = useState({});
  const [errors, setErrors] = useState({});

  const needsQuestionnaire = !!(formData.specialty && questionnaires[formData.specialty]);
  const totalSteps = needsQuestionnaire ? 4 : 3;
  const currentQuestions = needsQuestionnaire ? questionnaires[formData.specialty] : [];

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.specialty) {
      newErrors.specialty = t('errorRequired');
    } else if (!formData.doctorId) {
      newErrors.doctorId = t('errorRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.date || !formData.time) {
      newErrors.date = t('errorRequired');
      newErrors.time = t('errorRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const unanswered = currentQuestions.filter(q => !questionnaireAnswers[q.id]);
    if (unanswered.length > 0) {
      setErrors({ questionnaire: true });
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

  const doSubmit = () => {
    const bookedSlots = JSON.parse(localStorage.getItem('bookedSlots') || '[]');
    bookedSlots.push({
      doctorId: formData.doctorId,
      date: formData.date,
      time: formData.time,
      firstName: formData.firstName,
      lastName: formData.lastName,
      questionnaire: needsQuestionnaire ? questionnaireAnswers : null,
    });
    localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));

    const templateParams = {
      to_email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      date: formData.date,
      time: formData.time,
    };

    emailjs.send("service_z3oiuww", "template_jewyixe", templateParams, "1-6DRGxOV4Ph6kX5a")
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setIsSuccess(true);
      })
      .catch((err) => {
        console.error('FAILED...', err);
        setIsSuccess(true);
      });
  };

  const handleNext = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    if (step === 2) isValid = validateStep2();
    if (step === 3) isValid = validateStep3(); // only reached when needsQuestionnaire
    if (isValid) setStep(step + 1);
  };

  const handleSubmitFinal = () => {
    if (step === 3 && !needsQuestionnaire) {
      if (validateStep3()) doSubmit();
    } else if (step === 4) {
      if (validateStep4()) doSubmit();
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAnswerSelect = (questionId, option) => {
    setQuestionnaireAnswers(prev => ({ ...prev, [questionId]: option }));
    if (errors.questionnaire) {
      setErrors({});
    }
  };

  const showCursor = (fieldName) => {
    if (!guideMode) return false;

    const errorKeys = Object.keys(errors).filter(k => errors[k]);
    if (errorKeys.length > 0) {
      return errorKeys[0] === fieldName;
    }

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
      return fieldName === (needsQuestionnaire ? 'nextBtn' : 'submitBtn');
    }
    if (step === 4) {
      const firstUnanswered = currentQuestions.find(q => !questionnaireAnswers[q.id]);
      if (firstUnanswered) return fieldName === `q_${firstUnanswered.id}`;
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
          {t('backHome')}
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
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map(i => (
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
                setQuestionnaireAnswers({});
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

          {needsQuestionnaire && (
            <div className="info-banner" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e8f5f2', borderRadius: '8px', color: '#1b6255', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
              <span>📋 {t('questionnaireNotice')}</span>
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
            {generateWeekDays().map((date) => {
              const dateStr = date.toISOString().split('T')[0];
              const isToday = new Date().toISOString().split('T')[0] === dateStr;
              const isPastDate = date < new Date(new Date().setHours(0,0,0,0));
              let showFirstCursor = false;

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
                      ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30'].map((timeSlot) => {
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
                              className={`time-slot ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
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

      {step === 4 && (
        <div className="fade-in">
          <h2>{t('step4Title')}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.2rem' }}>
            {t('questionnaireIntro')}
          </p>

          {errors.questionnaire && (
            <div className="error-message" style={{ marginBottom: '1.5rem' }}>
              ⚠️ {t('errorQuestionnaire')}
            </div>
          )}

          {currentQuestions.map((question, idx) => {
            const isUnanswered = errors.questionnaire && !questionnaireAnswers[question.id];
            return (
              <div
                key={question.id}
                className={`questionnaire-question${isUnanswered ? ' questionnaire-question--error' : ''}`}
                style={{ position: 'relative' }}
              >
                {showCursor(`q_${question.id}`) && (
                  <div className="guide-cursor" style={{ right: '-10px', top: '10px' }}>👆</div>
                )}
                <p className="question-text">
                  {idx + 1}. {t(question.questionKey)}
                </p>
                <div className="answer-options">
                  {question.options.map(option => (
                    <button
                      key={option}
                      className={`answer-option${questionnaireAnswers[question.id] === option ? ' selected' : ''}`}
                      onClick={() => handleAnswerSelect(question.id, option)}
                    >
                      {t(option)}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
        {step > 1 ? (
          <button className="secondary" onClick={handleBack}>{t('backButton')}</button>
        ) : <div />}

        {step < totalSteps ? (
          <div style={{ position: 'relative' }}>
            {showCursor('nextBtn') && <div className="guide-cursor" style={{right: '40px', top: '-15px'}}>👆</div>}
            <button className="primary" onClick={handleNext}>{t('nextButton')}</button>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {showCursor('submitBtn') && <div className="guide-cursor" style={{right: '40px', top: '-15px'}}>👆</div>}
            <button className="primary" onClick={handleSubmitFinal}>{t('submitButton')}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wizard;
