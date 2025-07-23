import React from 'react';

export default function EyeCarePopup({ t, closeEyePopup }) {
  return (
    <div className="eyecare-popup-overlay">
      <div className="eyecare-popup">
        <h2>{t.eyeTitle}</h2>
        <p>{t.eyeMsg}<br /><span className="eyecare-rule">{t.eyeRule}</span></p>
        <button className="btn popup-btn" onClick={closeEyePopup}>{t.eyeBtn}</button>
      </div>
    </div>
  );
}
