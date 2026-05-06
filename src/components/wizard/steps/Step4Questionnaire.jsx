import React from 'react';
import { useI18n } from '../../../i18n';

const Step4Questionnaire = ({ questions, answers, errors, onAnswerSelect, notes, onNotesChange, showCursor }) => {
  const { t } = useI18n();

  return (
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

      {questions.map((question, idx) => {
        const isUnanswered = errors.questionnaire && !answers[question.id];
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
                  className={`answer-option${answers[question.id] === option ? ' selected' : ''}`}
                  onClick={() => onAnswerSelect(question.id, option)}
                >
                  {t(option)}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <div className="questionnaire-question" style={{ marginTop: '2rem' }}>
        <p className="question-text">📝 {t('questionnaireNotesLabel')}</p>
        <textarea
          value={notes}
          onChange={e => onNotesChange(e.target.value)}
          placeholder={t('questionnaireNotesPlaceholder')}
          rows={4}
          style={{
            width: '100%',
            fontSize: '1.2rem',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '2px solid var(--border-color)',
            resize: 'vertical',
            fontFamily: 'inherit',
            lineHeight: '1.6',
            boxSizing: 'border-box',
            marginTop: '0.5rem',
          }}
        />
      </div>
    </div>
  );
};

export default Step4Questionnaire;
