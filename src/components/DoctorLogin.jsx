import React, { useState } from 'react';
import { useI18n } from '../i18n';

const DoctorLogin = ({ onLogin, onCancel }) => {
  const { t } = useI18n();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '1234') {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="card fade-in" style={{ maxWidth: '500px', margin: '4rem auto' }}>
      <h2 style={{ textAlign: 'center' }}>{t('doctorLoginTitle')}</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <div className="form-group">
          <label>{t('passwordLabel')}</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            className={error ? 'error' : ''}
            autoFocus
          />
          {error && <div className="error-message">⚠️ {t('invalidPassword')}</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
          <button type="button" className="secondary" onClick={onCancel}>{t('backButton')}</button>
          <button type="submit" className="primary">{t('loginBtn')}</button>
        </div>
      </form>
    </div>
  );
};

export default DoctorLogin;
