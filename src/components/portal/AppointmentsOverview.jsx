import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n';
import { doctors } from '../../data/doctors';
import { campuses, getCampusForSpecialty } from '../../data/campuses';
import { getBookedSlots } from '../../services/appointmentService';
import CampusBadge from '../CampusBadge';

const SPECIALTY_META = {
  spec_cardiology:   { icon: '🫀', color: '#c0392b', bg: '#fdf0ef' },
  spec_orthopedics:  { icon: '🦴', color: '#2471a3', bg: '#eaf4fb' },
  spec_pediatrics:   { icon: '👶', color: '#1e8449', bg: '#eafaf1' },
  spec_ophthalmology:{ icon: '👁️', color: '#7d3c98', bg: '#f5eef8' },
};

function formatDate(dateStr, lang) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString(lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function isUpcoming(dateStr, timeStr) {
  const [h, m] = timeStr.split(':');
  const dt = new Date(dateStr + 'T00:00:00');
  dt.setHours(parseInt(h), parseInt(m), 0, 0);
  return dt >= new Date();
}

const AppointmentsOverview = ({ onBookAppointment }) => {
  const { t, lang } = useI18n();
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const raw = getBookedSlots();
    // Koppel artsinfo aan elke afspraak en filter alleen toekomstige
    const enriched = raw
      .map(slot => {
        const doctor = doctors.find(d => d.id === slot.doctorId);
        const campus = slot.campusId
          ? campuses[slot.campusId]
          : doctor ? getCampusForSpecialty(doctor.specialty) : null;
        return { ...slot, doctor, campus };
      })
      .filter(slot => slot.doctor && isUpcoming(slot.date, slot.time))
      .sort((a, b) => {
        const da = new Date(a.date + 'T' + a.time);
        const db = new Date(b.date + 'T' + b.time);
        return da - db;
      });
    setSlots(enriched);
  }, []);

  const cancelAppointment = (index) => {
    const raw = getBookedSlots();
    const enriched = raw
      .map(slot => ({ ...slot, doctor: doctors.find(d => d.id === slot.doctorId) }))
      .filter(slot => slot.doctor && isUpcoming(slot.date, slot.time))
      .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));

    const toRemove = enriched[index];
    const updated = raw.filter(
      s => !(s.doctorId === toRemove.doctorId && s.date === toRemove.date && s.time === toRemove.time)
    );
    localStorage.setItem('bookedSlots', JSON.stringify(updated));
    setSlots(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="aov-section">
      <div className="aov-header">
        <span className="aov-header-icon">📋</span>
        <h2 className="aov-title">{t('aov_title')}</h2>
      </div>

      {slots.length === 0 ? (
        <div className="aov-empty">
          <span className="aov-empty-icon">🗓️</span>
          <p className="aov-empty-text">{t('aov_empty')}</p>
          <button className="aov-book-btn" onClick={onBookAppointment}>
            📅 {t('portal_ctaBtn')}
          </button>
        </div>
      ) : (
        <div className="aov-list">
          {slots.map((slot, i) => {
            const meta = SPECIALTY_META[slot.doctor.specialty] ?? { icon: '🏥', color: '#555', bg: '#f5f5f5' };
            return (
              <div
                key={i}
                className="aov-card"
                style={{ borderLeftColor: meta.color, background: meta.bg }}
              >
                <div className="aov-card-icon" style={{ color: meta.color }}>
                  {meta.icon}
                </div>

                <div className="aov-card-body">
                  <div className="aov-card-specialty">{t(slot.doctor.specialty)}</div>
                  <div className="aov-card-doctor">{slot.doctor.name}</div>
                  <div className="aov-card-datetime">
                    <span className="aov-card-date">📅 {formatDate(slot.date, lang)}</span>
                    <span className="aov-card-time">🕐 {slot.time}</span>
                  </div>
                  {slot.campus && <CampusBadge campus={slot.campus} compact />}
                </div>

                <button
                  className="aov-cancel-btn"
                  onClick={() => cancelAppointment(i)}
                  aria-label={t('aov_cancel')}
                >
                  ✕ {t('aov_cancel')}
                </button>
              </div>
            );
          })}

          <button className="aov-add-btn" onClick={onBookAppointment}>
            ➕ {t('aov_addNew')}
          </button>
        </div>
      )}
    </section>
  );
};

export default AppointmentsOverview;
