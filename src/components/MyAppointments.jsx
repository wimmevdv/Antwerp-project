import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n';

const doctorsMap = {
  '1': 'Dr. Janssens',
  '2': 'Dr. Peeters',
  '3': 'Dr. Dubois',
  '4': 'Dr. Mertens',
};

const MyAppointments = ({ onModify }) => {
  const { t } = useI18n();
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookedSlots') || '[]');
    setSlots(saved);
  }, []);

  const handleCancel = (index) => {
    const updated = [...slots];
    updated.splice(index, 1);
    localStorage.setItem('bookedSlots', JSON.stringify(updated));
    setSlots(updated);
  };

  const handleModify = (index) => {
    handleCancel(index);
    onModify();
  };

  return (
    <div className="card fade-in">
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>{t('myAppointments')}</h2>
      
      {slots.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
          {t('noAppointments')}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {slots.map((slot, index) => (
            <div key={index} className="fade-in" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-color)' }}>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '1.3rem', margin: 0, color: 'var(--primary-color)' }}>{doctorsMap[slot.doctorId] || t('doctor')}</p>
                <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-main)', display: 'flex', gap: '15px' }}>
                  <span>📅 {slot.date}</span>
                  <span>🕒 {slot.time}</span>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="secondary" 
                  style={{ padding: '10px 15px', color: 'var(--error-color)', borderColor: 'var(--error-color)' }} 
                  onClick={() => handleCancel(index)}
                >
                  {t('cancelBtn')}
                </button>
                <button 
                  className="primary" 
                  style={{ padding: '10px 15px' }} 
                  onClick={() => handleModify(index)}
                >
                  {t('modifyBtn')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
