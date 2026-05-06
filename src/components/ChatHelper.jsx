import React, { useState } from 'react';
import { useI18n } from '../i18n';

const ChatHelper = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const handleHelpClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setShowPhone(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-bubble">
          <div style={{ marginBottom: '1rem', fontWeight: 600 }}>
            {t('chatGreeting')}
          </div>
          
          {!showPhone ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                className="secondary" 
                onClick={() => setShowPhone(true)}
                style={{ fontSize: '0.9rem', padding: '8px' }}
              >
                {t('chatTooComplicated')}
              </button>
            </div>
          ) : (
            <div className="fade-in" style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <p style={{ marginBottom: '10px', color: '#166534' }}>{t('chatCallUs')}</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#166534', margin: 0, textAlign: 'center' }}>
                {t('hospitalPhone')}
              </p>
            </div>
          )}
        </div>
      )}
      
      <button 
        className="chat-helper-btn" 
        onClick={handleHelpClick}
        aria-label="Besoin d'aide ?"
      >
        {isOpen ? '✕' : '?'}
      </button>
    </div>
  );
};

export default ChatHelper;
