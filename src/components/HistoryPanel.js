import React from 'react';
import { getTodayStr } from '../utils/date';

export default function HistoryPanel({ t, history }) {
  return (
    <div className="history-panel">
      <h3><span role="img" aria-label="history">📊</span> {t.history}</h3>
      <ul style={{listStyle:'none',padding:0,maxHeight:120,overflowY:'auto'}}>
        {Object.entries(history).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,7).map(([date, count]) => (
          <li key={date} style={{display:'flex',justifyContent:'space-between',padding:'2px 0'}}>
            <span>{date === getTodayStr() ? t.today : date}</span>
            <span><b>{count}</b> {t.session}</span>
          </li>
        ))}
        {Object.keys(history).length === 0 && <li>{t.noData}</li>}
      </ul>
    </div>
  );
}
