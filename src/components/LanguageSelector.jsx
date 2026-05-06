import React from 'react';
import { useI18n } from '../i18n';

const LanguageSelector = ({ lightText }) => {
  const { lang, setLang, t } = useI18n();

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <span style={{ fontWeight: 600, color: lightText ? 'white' : 'var(--text-muted)' }}>{t('language')}:</span>
      <select 
        value={lang} 
        onChange={(e) => setLang(e.target.value)}
        style={{ width: 'auto', padding: '8px 16px', fontSize: '1rem', cursor: 'pointer' }}
        aria-label={t('language')}
      >
        <option value="fr">Français</option>
        <option value="nl">Nederlands</option>
        <option value="en">English</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
