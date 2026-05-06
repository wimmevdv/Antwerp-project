import React from 'react';
import { useI18n } from '../i18n';

/**
 * Herbruikbaar campus-blok — groot en duidelijk voor ouderen.
 * Props:
 *   campus  — object uit campuses.js
 *   compact — kleinere variant voor in lijsten
 */
const CampusBadge = ({ campus, compact = false }) => {
  const { t } = useI18n();
  if (!campus) return null;

  if (compact) {
    return (
      <div className="campus-badge-compact">
        <span className="campus-badge-compact-icon">{campus.icon}</span>
        <span className="campus-badge-compact-name">{t(campus.nameKey)}</span>
        <span className="campus-badge-compact-addr">{campus.address}</span>
      </div>
    );
  }

  return (
    <div className="campus-badge">
      <div className="campus-badge-header">
        <span className="campus-badge-icon">{campus.icon}</span>
        <div>
          <div className="campus-badge-label">{t('campus_label')}</div>
          <div className="campus-badge-name">{t(campus.nameKey)}</div>
        </div>
      </div>
      <div className="campus-badge-address">📍 {campus.address}</div>
      <div className="campus-badge-transport">🚌 {campus.transport}</div>
      <a
        className="campus-badge-maps"
        href={campus.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('campus_maps')} →
      </a>
    </div>
  );
};

export default CampusBadge;
