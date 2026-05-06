import React, { useState } from 'react';
import { useI18n } from '../../i18n';
import { questionnaires } from '../../data/questionnaires';
import { saveAppointment, sendConfirmationEmail } from '../../services/appointmentService';
import WizardStepIndicator from './WizardStepIndicator';
import Step1Email from './steps/Step1Email';
import Step2Doctor from './steps/Step2Doctor';
import Step3Calendar from './steps/Step3Calendar';
import Step4Questionnaire from './steps/Step4Questionnaire';

const INITIAL_FORM = {
  email: '',
  specialty: '', doctorId: '',
  date: '', time: ''
};

const Wizard = ({ onReset }) => {
  const { t } = useI18n();

  const [step, setStep]                           = useState(1);
  const [isSuccess, setIsSuccess]                 = useState(false);
  const [guideMode, setGuideMode]                 = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [formData, setFormData]                   = useState(INITIAL_FORM);
  const [questionnaireAnswers, setAnswers]        = useState({});
  const [errors, setErrors]                       = useState({});

  const currentQuestions = questionnaires[formData.specialty] ?? [];
  const needsQuestionnaire = currentQuestions.length > 0;
  const totalSteps = needsQuestionnaire ? 4 : 3;

  // ── Validation ───────────────────────────────────────────────────────────

  const validateStep1 = () => {
    const e = {};
    if (!formData.email) {
      e.email = t('errorRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = t('errorEmail');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    if (!formData.specialty) return setErrors({ specialty: t('errorRequired') }), false;
    if (!formData.doctorId)  return setErrors({ doctorId: t('errorRequired') }), false;
    return setErrors({}), true;
  };

  const validateStep3 = () => {
    if (!formData.date || !formData.time) {
      setErrors({ date: t('errorRequired'), time: t('errorRequired') });
      return false;
    }
    return setErrors({}), true;
  };

  const validateStep4 = () => {
    const unanswered = currentQuestions.some(q => !questionnaireAnswers[q.id]);
    if (unanswered) return setErrors({ questionnaire: true }), false;
    return setErrors({}), true;
  };

  // ── Navigation ───────────────────────────────────────────────────────────

  const validators = { 1: validateStep1, 2: validateStep2, 3: validateStep3 };

  const handleNext = () => {
    if (validators[step]?.()) setStep(s => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep(s => s - 1);
  };

  const handleSubmitFinal = () => {
    const valid = step === 4 ? validateStep4() : validateStep3();
    if (!valid) return;

    saveAppointment({ formData, questionnaireAnswers, needsQuestionnaire });

    const subject = t('emailSubject');
    const message = `${t('emailGreeting')},\n\n${t('emailBody')} ${formData.date} ${t('at')} ${formData.time}.\n\n${t('emailClosing')}`;

    sendConfirmationEmail(formData, subject, message)
      .then(() => setIsSuccess(true))
      .catch(() => setIsSuccess(true));
  };

  // ── Form helpers ─────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSpecialtyChange = (e) => {
    handleChange(e);
    setFormData(prev => ({ ...prev, doctorId: '' }));
    setAnswers({});
  };

  const handleTimeSlotSelect = (dateStr, timeStr) => {
    setFormData(prev => ({ ...prev, date: dateStr, time: timeStr }));
    if (errors.date || errors.time) setErrors(prev => ({ ...prev, date: null, time: null }));
  };

  const handleAnswerSelect = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
    if (errors.questionnaire) setErrors({});
  };

  // ── Guide cursor ─────────────────────────────────────────────────────────

  const showCursor = (field) => {
    if (!guideMode) return false;
    const errorFields = Object.keys(errors).filter(k => errors[k]);
    if (errorFields.length > 0) return errorFields[0] === field;

    if (step === 1) {
      if (!formData.email) return field === 'email';
      return field === 'nextBtn';
    }
    if (step === 2) {
      if (!formData.specialty) return field === 'specialty';
      if (!formData.doctorId)  return field === 'doctorId';
      return field === 'nextBtn';
    }
    if (step === 3) {
      if (!formData.date || !formData.time) return field === 'timeSlot';
      return field === (needsQuestionnaire ? 'nextBtn' : 'submitBtn');
    }
    if (step === 4) {
      const first = currentQuestions.find(q => !questionnaireAnswers[q.id]);
      if (first) return field === `q_${first.id}`;
      return field === 'submitBtn';
    }
    return false;
  };

  // ── Success screen ───────────────────────────────────────────────────────

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

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="card fade-in">
      <button className="guide-toggle" onClick={() => setGuideMode(g => !g)}>
        {guideMode ? '🛑 ' + t('guideDisable') : '✨ ' + t('guideEnable')}
      </button>

      <WizardStepIndicator totalSteps={totalSteps} currentStep={step} />

      {step === 1 && (
        <Step1Email
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          showCursor={showCursor}
        />
      )}
      {step === 2 && (
        <Step2Doctor
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          onSpecialtyChange={handleSpecialtyChange}
          showCursor={showCursor}
          needsQuestionnaire={needsQuestionnaire}
        />
      )}
      {step === 3 && (
        <Step3Calendar
          formData={formData}
          errors={errors}
          currentWeekOffset={currentWeekOffset}
          setCurrentWeekOffset={setCurrentWeekOffset}
          onTimeSlotSelect={handleTimeSlotSelect}
          showCursor={showCursor}
        />
      )}
      {step === 4 && (
        <Step4Questionnaire
          questions={currentQuestions}
          answers={questionnaireAnswers}
          errors={errors}
          onAnswerSelect={handleAnswerSelect}
          showCursor={showCursor}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
        {step > 1 ? (
          <button className="secondary" onClick={handleBack}>{t('backButton')}</button>
        ) : <div />}

        {step < totalSteps ? (
          <div style={{ position: 'relative' }}>
            {showCursor('nextBtn') && <div className="guide-cursor" style={{ right: '40px', top: '-15px' }}>👆</div>}
            <button className="primary" onClick={handleNext}>{t('nextButton')}</button>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {showCursor('submitBtn') && <div className="guide-cursor" style={{ right: '40px', top: '-15px' }}>👆</div>}
            <button className="primary" onClick={handleSubmitFinal}>{t('submitButton')}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wizard;
