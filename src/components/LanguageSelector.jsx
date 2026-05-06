import React from 'react';
import { useI18n } from '../i18n';

const LanguageSelector = ({ lightText }) => {
  const { lang, setLang, t } = useI18n();

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => setLang('fr')}
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '1.8rem', 
            cursor: 'pointer', 
            opacity: lang === 'fr' ? 1 : 0.5,
            padding: '0 5px'
          }}
          title="Français"
        >
          🇫🇷
        </button>
        <button 
          onClick={() => setLang('nl')}
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '1.8rem', 
            cursor: 'pointer', 
            opacity: lang === 'nl' ? 1 : 0.5,
            padding: '0 5px'
          }}
          title="Nederlands"
        >
          🇳🇱
        </button>
        <button 
          onClick={() => setLang('en')}
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '1.8rem', 
            cursor: 'pointer', 
            opacity: lang === 'en' ? 1 : 0.5,
            padding: '0 5px'
          }}
          title="English"
        >
          🇬🇧
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
