import React from 'react';
import { useI18n } from '../../../i18n';
import { isSlotBooked } from '../../../services/appointmentService';

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30'];

function generateWeekDays(weekOffset) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();
  const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday + weekOffset * 7);

  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const Step2Calendar = ({ formData, errors, currentWeekOffset, setCurrentWeekOffset, onTimeSlotSelect, showCursor }) => {
  const { t, lang } = useI18n();
  const weekDays = generateWeekDays(currentWeekOffset);
  const todayStr = new Date().toISOString().split('T')[0];

  return (
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
        <h3>{t('weekOf')} {weekDays[0].toLocaleDateString(lang, { day: 'numeric', month: 'long' })}</h3>
        <button className="secondary" onClick={() => setCurrentWeekOffset(prev => prev + 1)}>
          {t('nextWeek')} &gt;
        </button>
      </div>

      <div className="calendar-grid">
        {weekDays.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          const isToday = dateStr === todayStr;
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
          let showFirstCursor = false;

          return (
            <div key={dateStr} className="calendar-day">
              <div className="calendar-day-header">
                <strong>{date.toLocaleDateString(lang, { weekday: 'long' })}</strong>
                <span>{date.getDate()}</span>
              </div>
              <div className="calendar-slots">
                {isPast ? (
                  <div style={{ textAlign: 'center', padding: '1rem', color: '#a0a0a0' }}>-</div>
                ) : (
                  TIME_SLOTS.map(slot => {
                    const booked = isSlotBooked(formData.doctorId, dateStr, slot);
                    const selected = formData.date === dateStr && formData.time === slot;

                    let pastTime = false;
                    if (isToday) {
                      const [h, m] = slot.split(':');
                      const slotDate = new Date();
                      slotDate.setHours(parseInt(h), parseInt(m), 0, 0);
                      pastTime = slotDate < new Date();
                    }

                    const disabled = booked || pastTime;

                    return (
                      <div style={{ position: 'relative' }} key={slot}>
                        {showCursor('timeSlot') && !disabled && !formData.time && !showFirstCursor && (() => {
                          showFirstCursor = true;
                          return <div className="guide-cursor" style={{ right: '-20px', top: '0px', zIndex: 100, fontSize: '3rem' }}>👆</div>;
                        })()}
                        <button
                          className={`time-slot${selected ? ' selected' : ''}`}
                          disabled={disabled}
                          onClick={() => onTimeSlotSelect(dateStr, slot)}
                        >
                          {slot}
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

      {(errors.date || errors.time) && (
        <div className="error-message" style={{ marginTop: '1rem' }}>⚠️ {t('errorRequired')}</div>
      )}
    </div>
  );
};

export default Step2Calendar;
