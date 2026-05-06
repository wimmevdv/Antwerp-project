import React, { useState } from 'react';
import { useI18n } from '../i18n';
import LanguageSelector from './LanguageSelector';
import AppointmentsOverview from './portal/AppointmentsOverview';

const NAV_LINKS = ['home', 'portal_about', 'portal_services', 'portal_contact'];

const Portal = ({ onBookAppointment, onDoctorLogin }) => {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="portal-root">

      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <header className="portal-nav">
        <div className="portal-nav-inner">
          <div className="portal-logo">
            <span className="portal-logo-icon">🏥</span>
            <span className="portal-logo-text">ZAS <span style={{ fontWeight: 300 }}>Ziekenhuis</span></span>
          </div>

          <nav className="portal-links">
            {NAV_LINKS.map(key => (
              <a key={key} href="#" className="portal-nav-link">{t(key)}</a>
            ))}
          </nav>

          <div className="portal-nav-right">
            <LanguageSelector />
            <div className="portal-account">
              <div className="portal-avatar">👤</div>
              <span className="portal-account-label">{t('portal_myAccount')}</span>
            </div>
            <button className="portal-login-btn" onClick={onDoctorLogin}>
              {t('portal_login')}
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="portal-hero">
        <div className="portal-hero-inner">
          <div className="portal-hero-badge">{t('portal_heroBadge')}</div>
          <h1 className="portal-hero-title">{t('portal_heroTitle')}</h1>
          <p className="portal-hero-sub">{t('portal_heroSub')}</p>

          <button className="portal-cta-btn" onClick={onBookAppointment}>
            📅 {t('portal_ctaBtn')}
          </button>

          <div className="portal-hero-features">
            {['portal_feat1', 'portal_feat2', 'portal_feat3'].map(key => (
              <div key={key} className="portal-feat-chip">✓ {t(key)}</div>
            ))}
          </div>
        </div>

        <div className="portal-hero-graphic">
          <div className="portal-graphic-card portal-graphic-card--top">
            <span style={{ fontSize: '2rem' }}>🫀</span>
            <span>{t('spec_cardiology')}</span>
          </div>
          <div className="portal-graphic-card portal-graphic-card--mid">
            <span style={{ fontSize: '2rem' }}>🦴</span>
            <span>{t('spec_orthopedics')}</span>
          </div>
          <div className="portal-graphic-card portal-graphic-card--bot">
            <span style={{ fontSize: '2rem' }}>👁️</span>
            <span>{t('spec_ophthalmology')}</span>
          </div>
        </div>
      </section>

      {/* ── Afspraken overzicht ──────────────────────────────────────── */}
      <AppointmentsOverview onBookAppointment={onBookAppointment} />

      {/* ── Services strip ───────────────────────────────────────────── */}
      <section className="portal-services">
        {[
          { icon: '🫀', key: 'spec_cardiology',       desc: 'portal_cardio_desc' },
          { icon: '🦴', key: 'spec_orthopedics',      desc: 'portal_ortho_desc' },
          { icon: '👶', key: 'spec_pediatrics',       desc: 'portal_peds_desc' },
          { icon: '👁️', key: 'spec_ophthalmology',    desc: 'portal_opht_desc' },
          { icon: '🧠', key: 'spec_neurology',        desc: 'portal_neuro_desc' },
          { icon: '🩺', key: 'spec_dermatology',      desc: 'portal_derm_desc' },
          { icon: '🫃', key: 'spec_gastroenterology', desc: 'portal_gastro_desc' },
        ].map(({ icon, key, desc }) => (
          <div key={key} className="portal-service-card" onClick={onBookAppointment}>
            <div className="portal-service-icon">{icon}</div>
            <h3>{t(key)}</h3>
            <p>{t(desc)}</p>
            <span className="portal-service-cta">{t('portal_bookNow')} →</span>
          </div>
        ))}
      </section>

      {/* ── Info banner ──────────────────────────────────────────────── */}
      <section className="portal-info-strip">
        {[
          { icon: '🕐', label: 'portal_info_hours',   value: 'portal_info_hours_val' },
          { icon: '📞', label: 'portal_info_phone',   value: 'hospitalPhone' },
          { icon: '📍', label: 'portal_info_address', value: 'portal_info_address_val' },
        ].map(({ icon, label, value }) => (
          <div key={label} className="portal-info-item">
            <span className="portal-info-icon">{icon}</span>
            <div>
              <div className="portal-info-label">{t(label)}</div>
              <div className="portal-info-value">{t(value)}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="portal-footer">
        <span>© 2026 ZAS Ziekenhuis</span>
        <span
          style={{ cursor: 'pointer', opacity: 0.6, fontSize: '0.85rem' }}
          onClick={onDoctorLogin}
        >
          {t('proAccess')}
        </span>
      </footer>

    </div>
  );
};

export default Portal;
