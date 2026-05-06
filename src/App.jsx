import React, { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from './i18n';
import LanguageSelector from './components/LanguageSelector';
import Wizard from './components/Wizard';
import ChatHelper from './components/ChatHelper';
import DoctorLogin from './components/DoctorLogin';
import DoctorDashboard from './components/DoctorDashboard';

const KioskApp = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [view, setView] = useState('wizard');
  const { t } = useI18n();

  useEffect(() => {
    let timeout;
    
    const resetTimer = () => {
      if (isSessionActive) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setIsSessionActive(false);
          setView('wizard');
        }, 120000); // 2 minutes d'inactivité
      }
    };

    if (isSessionActive) {
      resetTimer();
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('mousedown', resetTimer);
      window.addEventListener('keypress', resetTimer);
      window.addEventListener('touchstart', resetTimer);
    }

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, [isSessionActive]);

  if (!isSessionActive) {
    return (
      <div className="splash-screen" onClick={() => { setIsSessionActive(true); setView('wizard'); }}>
        <div style={{ fontSize: '8rem', animation: 'pointAndBounce 1.5s infinite' }}>👆</div>
        <h1>{t('touchToStart')}</h1>
        <div style={{ marginTop: '3rem', background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px' }} onClick={(e) => e.stopPropagation()}>
          <LanguageSelector lightText />
        </div>
        
        {/* Hidden link for doctors on the splash screen too just in case */}
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '0.8rem', opacity: 0.5 }}>
          <span style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setIsSessionActive(true); setView('doctorLogin'); }}>
            {t('proAccess')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="header">
        <div className="logo" onClick={() => { setIsSessionActive(false); setView('wizard'); }} style={{cursor: 'pointer'}} title="Retour à l'accueil">ZAS 🏥</div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <LanguageSelector />
        </div>
      </header>
      
      <main className="container" style={{ flex: 1 }}>
        {view === 'wizard' && (
          <Wizard onReset={() => { setIsSessionActive(false); setView('wizard'); }} />
        )}
        {view === 'doctorLogin' && (
          <DoctorLogin 
            onLogin={() => setView('doctorDashboard')} 
            onCancel={() => { setIsSessionActive(false); setView('wizard'); }} 
          />
        )}
        {view === 'doctorDashboard' && (
          <DoctorDashboard onBack={() => { setIsSessionActive(false); setView('wizard'); }} />
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setView('doctorLogin'); }}>
          {t('proAccess')}
        </span>
      </footer>

      {view === 'wizard' && <ChatHelper />}
    </div>
  );
};

function App() {
  return (
    <I18nProvider>
      <KioskApp />
    </I18nProvider>
  );
}

export default App;
