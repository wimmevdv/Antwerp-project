import React, { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from './i18n';
import LanguageSelector from './components/LanguageSelector';
import Portal from './components/Portal';
import Wizard from './components/wizard/Wizard';
import ChatHelper from './components/ChatHelper';
import DoctorLogin from './components/DoctorLogin';
import DoctorDashboard from './components/DoctorDashboard';

const App = () => {
  const [view, setView] = useState('portal');
  const { t } = useI18n();

  // Inactiviteitstimer — enkel actief tijdens kiosk-sessie
  useEffect(() => {
    if (view !== 'wizard') return;
    let timeout;
    const reset = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setView('portal'), 120000);
    };
    reset();
    window.addEventListener('mousemove', reset);
    window.addEventListener('mousedown', reset);
    window.addEventListener('keypress', reset);
    window.addEventListener('touchstart', reset);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('mousedown', reset);
      window.removeEventListener('keypress', reset);
      window.removeEventListener('touchstart', reset);
    };
  }, [view]);

  // ── Portal (hoofdpagina) ─────────────────────────────────────────
  if (view === 'portal') {
    return (
      <Portal
        onBookAppointment={() => setView('wizard')}
        onDoctorLogin={() => setView('doctorLogin')}
      />
    );
  }

  // ── Kiosk wizard + dokter views ──────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="header">
        <div
          className="logo"
          onClick={() => setView('portal')}
          style={{ cursor: 'pointer' }}
          title="Terug naar portaal"
        >
          ZAS 🏥
        </div>
        <LanguageSelector />
      </header>

      <main className="container" style={{ flex: 1 }}>
        {view === 'wizard' && (
          <Wizard onReset={() => setView('portal')} />
        )}
        {view === 'doctorLogin' && (
          <DoctorLogin
            onLogin={() => setView('doctorDashboard')}
            onCancel={() => setView('portal')}
          />
        )}
        {view === 'doctorDashboard' && (
          <DoctorDashboard onBack={() => setView('portal')} />
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setView('doctorLogin')}>
          {t('proAccess')}
        </span>
      </footer>

      {view === 'wizard' && <ChatHelper />}
    </div>
  );
};

function AppWithI18n() {
  return (
    <I18nProvider>
      <App />
    </I18nProvider>
  );
}

export default AppWithI18n;
