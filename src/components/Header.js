import React from 'react';
import { FiSettings, FiHelpCircle } from 'react-icons/fi';

export default function Header({ lang, setLang, t, setShowGuide, setShowSettings }) {
  return (
    <div className="header-actions">
      <div className="lang-toggle" title={t.lang}>
        <button
          className={`lang-switch${lang === 'vi' ? ' active' : ''}`}
          onClick={() => setLang('vi')}
          aria-label="Tiếng Việt"
        >VI</button>
        <button
          className={`lang-switch${lang === 'en' ? ' active' : ''}`}
          onClick={() => setLang('en')}
          aria-label="English"
        >EN</button>
      </div>
      <button className="icon-btn guide-btn" onClick={() => setShowGuide(true)} title={t.guide}>
        <FiHelpCircle size={26} />
      </button>
      <button className="icon-btn settings-btn" onClick={() => setShowSettings(true)} title={t.settings}>
        <FiSettings size={26} />
      </button>
    </div>
  );
}
