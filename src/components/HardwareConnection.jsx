import React, { useState, useEffect } from 'react';
import { Cable, Unplug, AlertTriangle, Wifi, WifiOff } from 'lucide-react';

const HardwareConnection = ({
  mode, setMode,
  wsRef,
  hardwareStatus, setHardwareStatus,
  connectionError, setConnectionError
}) => {
  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPorts = async () => {
    try {
      const res = await fetch('http://localhost:8080/ports');
      const data = await res.json();
      setPorts(data);
      if (data.length > 0 && !selectedPort) setSelectedPort(data[0].path);
    } catch {
      /* bridge not running */
    }
  };

  useEffect(() => { if (mode === 'HARDWARE') fetchPorts(); }, [mode]);

  const connectHardware = () => {
    setLoading(true);
    setConnectionError(null);
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => ws.send(JSON.stringify({ command: 'CONNECT', port: selectedPort }));
    ws.onerror = () => {
      setConnectionError('Cannot reach local bridge (ws://localhost:8080). Run: cd bridge && npm start');
      setHardwareStatus('DISCONNECTED');
      setLoading(false);
    };
    ws.onclose = () => setHardwareStatus('DISCONNECTED');
    wsRef.current = ws;
  };

  const disconnectHardware = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ command: 'DISCONNECT' }));
      wsRef.current.close();
      wsRef.current = null;
    }
    setHardwareStatus('DISCONNECTED');
  };

  return (
    <section className="panel">
      <div className="panel-title">
        <Cable size={16} />
        System Mode & Connection
      </div>

      {/* Mode Toggle */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'
      }}>
        <button
          onClick={() => { if (hardwareStatus === 'CONNECTED') disconnectHardware(); setMode('SIMULATION'); }}
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: mode === 'SIMULATION' ? '1px solid rgba(251,191,36,0.5)' : '1px solid var(--border-subtle)',
            background: mode === 'SIMULATION' ? 'rgba(251,191,36,0.08)' : 'var(--bg-card)',
            color: mode === 'SIMULATION' ? 'var(--amber)' : 'var(--text-dim)',
            cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
            fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'var(--transition)',
            boxShadow: mode === 'SIMULATION' ? '0 0 20px rgba(251,191,36,0.1)' : 'none',
          }}
        >
          <span className="status-indicator warning" style={{ width: '8px', height: '8px' }}></span>
          Simulation Mode
        </button>

        <button
          onClick={() => setMode('HARDWARE')}
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: mode === 'HARDWARE' ? '1px solid rgba(0,229,194,0.5)' : '1px solid var(--border-subtle)',
            background: mode === 'HARDWARE' ? 'rgba(0,229,194,0.06)' : 'var(--bg-card)',
            color: mode === 'HARDWARE' ? 'var(--cyan)' : 'var(--text-dim)',
            cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
            fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'var(--transition)',
            boxShadow: mode === 'HARDWARE' ? '0 0 20px rgba(0,229,194,0.08)' : 'none',
          }}
        >
          <span className={`status-indicator ${hardwareStatus === 'CONNECTED' ? 'on' : 'off'}`} style={{ width: '8px', height: '8px' }}></span>
          Real Hardware Mode
        </button>
      </div>

      {/* Hardware Config */}
      {mode === 'HARDWARE' && (
        <div style={{
          background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)', padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div className="metric-label" style={{ marginBottom: '8px' }}>COM Port</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={selectedPort}
                  onChange={e => setSelectedPort(e.target.value)}
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.04)', color: 'var(--text-main)',
                    border: '1px solid var(--border-subtle)', padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem', cursor: 'pointer', outline: 'none',
                  }}
                >
                  <option value="">-- Select Port --</option>
                  {ports.map(p => (
                    <option key={p.path} value={p.path}>
                      {p.path} {p.manufacturer ? `(${p.manufacturer})` : ''}
                    </option>
                  ))}
                </select>
                <button className="btn" onClick={fetchPorts} style={{ padding: '8px 12px' }}>Refresh</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <div className="metric-label" style={{ alignSelf: 'center', marginRight: '4px' }}>Baud: 115200</div>
              {hardwareStatus !== 'CONNECTED' ? (
                <button
                  className="btn"
                  onClick={connectHardware}
                  disabled={!selectedPort || loading}
                  style={{ borderColor: 'var(--green)', color: 'var(--green)', gap: '8px' }}
                >
                  <Wifi size={14} /> {loading ? 'Connecting…' : 'Connect'}
                </button>
              ) : (
                <button
                  className="btn btn-danger"
                  onClick={disconnectHardware}
                  style={{ borderColor: 'var(--red)', color: 'var(--red)', gap: '8px' }}
                >
                  <WifiOff size={14} /> Disconnect
                </button>
              )}
            </div>
          </div>

          {hardwareStatus === 'CONNECTED' && (
            <div style={{
              marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', background: 'rgba(16,217,138,0.06)',
              borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16,217,138,0.2)'
            }}>
              <span className="status-indicator on"></span>
              <span style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                ATmega328P connected via {selectedPort} @ 115200 baud
              </span>
            </div>
          )}

          {connectionError && (
            <div style={{
              marginTop: '1rem', display: 'flex', gap: '10px', alignItems: 'flex-start',
              padding: '10px 14px', background: 'rgba(255,71,87,0.06)',
              borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,71,87,0.2)'
            }}>
              <AlertTriangle size={16} style={{ color: 'var(--red)', flexShrink: 0, marginTop: '1px' }} />
              <span style={{ color: 'var(--red)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                {connectionError}
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default HardwareConnection;
