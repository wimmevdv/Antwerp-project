import React from 'react';
import { useI18n } from '../i18n';

const ChatHelper = () => {
  const { t } = useI18n();

  return (
    <div className="chat-widget">
      <div 
        className="chat-helper-btn" 
        style={{ 
          padding: '12px 24px', 
          borderRadius: '30px', 
          width: 'auto', 
          height: 'auto', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          cursor: 'default',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <span style={{ fontSize: '1.8rem' }}>📞</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 'normal', opacity: 0.9 }}>{t('chatTooComplicated')} ?</span>
          <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{t('hospitalPhone')}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHelper;
