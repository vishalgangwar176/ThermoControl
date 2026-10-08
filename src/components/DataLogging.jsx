import React from 'react';
import { Database, Trash2, Download } from 'lucide-react';

const DataLogging = ({ logData, setLogData }) => {
  const exportCSV = () => {
    if (!logData.length) return;
    let csv = 'data:text/csv;charset=utf-8,Time,ADC,Temperature,Fan,Relay,S1,S2,S3,S4\n';
    logData.forEach(r => {
      csv += `${r.time},${r.adc},${r.temp},${r.fan},${r.relay},${r.s1 || ''},${r.s2 || ''},${r.s3 || ''},${r.s4 || ''}\n`;
    });
    const a = document.createElement('a');
    a.href = encodeURI(csv);
    a.download = 'icps_log.csv';
    a.click();
  };

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="panel-title" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
          <Database size={16} /> System Data Log
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn" onClick={() => setLogData([])} style={{ gap: '6px' }}>
            <Trash2 size={12} /> Clear
          </button>
          <button className="btn" onClick={exportCSV} style={{ gap: '6px', borderColor: 'var(--cyan)', color: 'var(--cyan)' }}>
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto', maxHeight: '260px', overflowY: 'auto' }}>
        <table>
          <thead>
            <tr>
              {['Time', 'ADC', 'Temp (°C)', 'Fan', 'Relay'].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {logData.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  No data yet. Start simulation or connect hardware.
                </td>
              </tr>
            ) : (
              [...logData].reverse().map((r, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-dim)' }}>{r.time}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{r.adc}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--cyan)' }}>{r.temp}</td>
                  <td>
                    <span className={`badge ${r.fan === 'ON' ? 'badge-green' : 'badge-red'}`}>{r.fan}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: (r.relay === 'ON' || r.relay === 'ACTIVE') ? 'var(--green)' : 'var(--text-dim)' }}>
                      {r.relay}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DataLogging;
