import React from 'react';

export default function GuideModal({ t, lang, setShowGuide }) {
  return (
    <div className="guide-modal-overlay" onClick={e => {if(e.target.className==='guide-modal-overlay') setShowGuide(false)}}>
      <div className="guide-modal">
        <h2>{t.guideTitle}</h2>
        <ul className="guide-list">
          <li><b>Pomodoro:</b> {lang==='vi'? 'Làm việc tập trung 25 phút, sau đó nghỉ ngắn 5 phút. Sau 4 phiên, nghỉ dài 15 phút.' : 'Focus for 25 minutes, then take a 5-minute break. After 4 sessions, take a 15-minute long break.'}</li>
          <li><b>{t.eyeTitle}</b> {lang==='vi'? 'Sau mỗi phiên làm việc, hãy rời mắt khỏi màn hình 20 giây (nguyên tắc 20-20-20).' : 'After each session, look away from the screen for 20 seconds (20-20-20 rule).'}</li>
          <li><b>{t.todoTitle}:</b> {lang==='vi'? 'Quản lý công việc cần làm trong ngày.' : 'Manage your daily tasks.'}</li>
          <li><b>{t.history}:</b> {lang==='vi'? 'Theo dõi số phiên Pomodoro mỗi ngày.' : 'Track your Pomodoro sessions per day.'}</li>
          <li><b>{t.settings}:</b> {lang==='vi'? 'Tuỳ chỉnh thời gian, tự động chuyển phiên.' : 'Customize durations, auto session switch.'}</li>
          <li><b>{t.lang}:</b> {lang==='vi'? 'Chuyển đổi ngôn ngữ Anh/Việt.' : 'Switch between English/Vietnamese.'}</li>
          <li><b>{t.shortcut}:</b>
            <ul className="shortcut-list">
              {t.shortcuts.map(s => <li key={s.key}><b>{s.key}</b>: {s.desc}</li>)}
            </ul>
          </li>
        </ul>
        <button className="btn guide-close-btn" onClick={()=>setShowGuide(false)}>{t.guideClose}</button>
      </div>
    </div>
  );
}
