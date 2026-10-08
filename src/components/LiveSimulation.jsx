import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { Activity, Play, Pause, RotateCcw, Sliders, Wind } from 'lucide-react';

/* ── Custom Recharts tooltip ───────────────────────── */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value;
  return (
    <div style={{
      background: 'rgba(10,16,28,0.95)', border: '1px solid rgba(0,229,194,0.3)',
      borderRadius: '8px', padding: '8px 14px', backdropFilter: 'blur(20px)',
      fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
    }}>
      <span style={{ color: 'var(--cyan)' }}>{v?.toFixed(2)} °C</span>
    </div>
  );
};

/* ── ADC sample row ────────────────────────────────── */
const SampleRow = ({ idx, value }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)'
  }}>
    <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
      Sample {idx}
    </span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: `${Math.max(20, (value / 120) * 90)}px`, height: '4px',
        borderRadius: '2px',
        background: 'linear-gradient(90deg, rgba(0,229,194,0.4), var(--cyan))',
        transition: 'width 0.4s ease'
      }} />
      <span style={{ color: 'var(--text-bright)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', minWidth: '28px', textAlign: 'right' }}>
        {value}
      </span>
    </div>
  </div>
);

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════ */
const LiveSimulation = ({
  mode, temperature, setTemperature, adcValue, fanOn,
  simRunning, setSimRunning, hardwareStatus
}) => {
  const [history, setHistory] = useState([]);

  // Stable sample values based on adcValue
  const samples = useMemo(() => {
    const jitter = (n) => Math.max(0, Math.min(1023, n + Math.round((Math.random() - 0.5) * 2)));
    return [adcValue - 1, adcValue, jitter(adcValue), adcValue];
  }, [adcValue]);

  useEffect(() => {
    setHistory(prev => {
      const next = [...prev, { t: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), temp: temperature }];
      return next.length > 60 ? next.slice(-60) : next;
    });
  }, [temperature]);

  /* ── Derived colours ────────────────────────────── */
  const tempColor = temperature >= 40.0 ? 'var(--red)' : temperature >= 34.7 ? 'var(--amber)' : 'var(--cyan)';
  const fanColor  = fanOn ? 'var(--green)' : 'var(--text-dim)';
  const pct       = Math.max(0, Math.min(100, ((temperature - 20) / 30) * 100));

  return (
    <section className="panel">
      {/* Section header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div className="panel-title" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
          <Activity size={16} />
          {mode === 'SIMULATION' ? 'Live System Simulation' : 'Live Hardware Monitoring'}
        </div>
        <div className={`badge ${mode === 'SIMULATION' ? 'badge-amber' : hardwareStatus === 'CONNECTED' ? 'badge-green' : 'badge-red'}`}>
          <span className={`status-indicator ${mode === 'SIMULATION' ? 'warning' : hardwareStatus === 'CONNECTED' ? 'on' : 'off'}`}></span>
          {mode === 'SIMULATION' ? 'Simulation Data' : hardwareStatus === 'CONNECTED' ? 'Real Hardware' : 'Hardware Offline'}
        </div>
      </div>

      {/* ── Top Metric Cards ─────────────────────── */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>

        {/* Temperature */}
        <div className="metric-card" style={{ borderColor: `rgba(${fanOn ? '255,71,87' : '0,229,194'},0.2)` }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'var(--radius-md)',
            background: fanOn
              ? 'radial-gradient(ellipse at 50% 0%, rgba(255,71,87,0.06) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at 50% 0%, rgba(0,229,194,0.05) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div className="metric-label">LM35 Temperature</div>
          <div className="metric-value" style={{ color: tempColor, fontSize: '2.6rem' }}>
            {temperature.toFixed(2)}
          </div>
          <div style={{ color: tempColor, fontSize: '1.1rem', opacity: 0.7, fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>°C</div>
          <div className="metric-sub">10 mV / °C</div>
        </div>

        {/* ADC */}
        <div className="metric-card">
          <div className="metric-label">10-bit ADC Value</div>
          <div className="metric-value" style={{ color: 'var(--text-dim)', fontSize: '2.6rem' }}>
            {adcValue}
          </div>
          <div style={{ margin: '0.5rem 0' }}>
            <div style={{
              height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', borderRadius: '2px',
                width: `${(adcValue / 1023) * 100}%`,
                background: 'linear-gradient(90deg, var(--blue), var(--cyan))',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
          <div className="metric-sub">Ref: 5V · ~0.488°C/count</div>
        </div>

        {/* Fan */}
        <div className="metric-card" style={{ borderColor: `rgba(${fanOn ? '16,217,138' : '255,71,87'},0.25)` }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'var(--radius-md)',
            background: fanOn
              ? 'radial-gradient(ellipse at 50% 100%, rgba(16,217,138,0.08) 0%, transparent 70%)'
              : 'transparent',
            pointerEvents: 'none'
          }} />
          <div className="metric-label">DC Cooling Fan</div>
          <div className="metric-value" style={{ fontSize: '2.6rem', color: fanColor }}>{fanOn ? 'ON' : 'OFF'}</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 6px' }}>
            <Wind
              size={22}
              color={fanColor}
              className={fanOn ? 'anim-spin' : ''}
              style={{ transition: 'color 0.4s' }}
            />
          </div>
          <div className="metric-sub">{fanOn ? 'Cooling active' : 'Fan idle'}</div>
        </div>

        {/* Relay */}
        <div className="metric-card" style={{ borderColor: `rgba(${fanOn ? '16,217,138' : '90,112,144'},0.25)` }}>
          <div className="metric-label">Relay Module</div>
          <div className="metric-value" style={{ fontSize: '2.1rem', color: fanOn ? 'var(--green)' : 'var(--text-dim)' }}>
            {fanOn ? 'ACTIVE' : 'IDLE'}
          </div>
          <div style={{ margin: '0.75rem 0' }}>
            {/* Relay animation */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center' }}>
              <div style={{
                width: '32px', height: '14px',
                border: `2px solid ${fanOn ? 'var(--green)' : 'var(--text-dim)'}`,
                borderRadius: '3px', position: 'relative',
                boxShadow: fanOn ? '0 0 10px rgba(16,217,138,0.3)' : 'none',
                transition: 'all 0.4s ease'
              }}>
                <div style={{
                  position: 'absolute', top: '1px',
                  left: fanOn ? 'calc(100% - 10px)' : '1px',
                  width: '8px', height: '8px',
                  background: fanOn ? 'var(--green)' : 'var(--text-dim)',
                  borderRadius: '1px', transition: 'all 0.3s ease'
                }} />
              </div>
            </div>
          </div>
          <div className="metric-sub">MCU: ATmega328P</div>
        </div>
      </div>

      {/* ── ADC Sampling + Hysteresis ─────────────── */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>

        {/* ADC Sampling */}
        <div className="card">
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)'
          }}>
            <Sliders size={13} color="var(--cyan)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              ADC Sampling · 4-sample avg
            </span>
          </div>

          <SampleRow idx={1} value={samples[0]} />
          <SampleRow idx={2} value={samples[1]} />
          <SampleRow idx={3} value={samples[2]} />
          <SampleRow idx={4} value={samples[3]} />

          <div className="divider" />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>SUM</span>
            <span style={{ color: 'var(--text-bright)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
              {samples.reduce((a, b) => a + b, 0)}
            </span>
          </div>

          <div style={{
            padding: '8px 12px', borderRadius: 'var(--radius-sm)',
            background: 'rgba(0,229,194,0.06)', border: '1px solid rgba(0,229,194,0.15)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              avg = sum &gt;&gt; 2
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--cyan)' }}>
              {adcValue}
            </span>
          </div>
          <div style={{ marginTop: '8px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            T = {adcValue} × 125 / 256 ≈ {temperature.toFixed(2)}°C
          </div>
        </div>

        {/* Hysteresis - spans 2 columns */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Automatic Cooling Control · 5°C Hysteresis
            </span>
          </div>

          {/* Threshold labels */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,71,87,0.07)', border: '1px solid rgba(255,71,87,0.2)' }}>
              <div style={{ color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '1.5px', marginBottom: '4px' }}>OFF THRESHOLD</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-bright)' }}>ADC ≤ 71</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>≈ 34.7°C</div>
            </div>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <div style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '1.5px', marginBottom: '4px' }}>HYSTERESIS ZONE</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-bright)' }}>ADC 72–81</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>Maintain State</div>
            </div>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(16,217,138,0.07)', border: '1px solid rgba(16,217,138,0.2)' }}>
              <div style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '1.5px', marginBottom: '4px' }}>ON THRESHOLD</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-bright)' }}>ADC ≥ 82</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>≈ 40.0°C</div>
            </div>
          </div>

          {/* Visual temperature bar */}
          <div style={{ position: 'relative', height: '36px', borderRadius: '18px', overflow: 'hidden', marginBottom: '8px' }}>
            {/* Background zones */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
              <div style={{ flex: '0 0 50%', background: 'rgba(255,71,87,0.12)' }} />
              <div style={{ flex: '0 0 16%', background: 'rgba(251,191,36,0.12)' }} />
              <div style={{ flex: '0 0 34%', background: 'rgba(16,217,138,0.12)' }} />
            </div>
            {/* Threshold lines */}
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,71,87,0.5)' }} />
            <div style={{ position: 'absolute', left: '66%', top: 0, bottom: 0, width: '1px', background: 'rgba(16,217,138,0.5)' }} />
            {/* Pointer */}
            <div style={{
              position: 'absolute', top: '50%', left: `${pct}%`,
              transform: 'translate(-50%, -50%)',
              width: '20px', height: '20px',
              borderRadius: '50%',
              background: tempColor,
              border: '3px solid rgba(0,0,0,0.5)',
              boxShadow: `0 0 12px ${tempColor}`,
              transition: 'left 0.6s cubic-bezier(0.4,0,0.2,1), background 0.4s'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            <span>20°C</span><span>34.7°C</span><span>40°C</span><span>50°C</span>
          </div>

          <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.6 }}>
            Two different switching thresholds reduce rapid relay switching. Current: <span style={{ color: tempColor, fontFamily: 'var(--font-mono)' }}>{temperature.toFixed(2)}°C</span>
          </p>
        </div>
      </div>

      {/* ── Real-Time Graph ───────────────────────── */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
            Real-Time Temperature Curve
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {mode === 'SIMULATION' && (
              <>
                <button className={`btn ${simRunning ? 'active' : ''}`} onClick={() => setSimRunning(true)}>
                  <Play size={12} /> Start
                </button>
                <button className="btn" onClick={() => setSimRunning(false)}>
                  <Pause size={12} /> Pause
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-dim)' }}>Manual:</span>
                  <input
                    type="range" min="20" max="50" step="0.1" value={temperature}
                    onChange={e => { setSimRunning(false); setTemperature(parseFloat(e.target.value)); }}
                    style={{ width: '100px' }}
                  />
                </div>
              </>
            )}
            <button className="btn" onClick={() => setHistory([])}>
              <RotateCcw size={12} /> Clear
            </button>
          </div>
        </div>

        <div style={{ height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e5c2" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00e5c2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="t" stroke="var(--text-dim)" fontSize={10} tick={{ fontFamily: 'var(--font-mono)' }} interval="preserveStartEnd" />
              <YAxis domain={[20, 50]} stroke="var(--text-dim)" fontSize={10} tick={{ fontFamily: 'var(--font-mono)' }} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={40.0} stroke="rgba(16,217,138,0.6)" strokeDasharray="4 4"
                label={{ value: 'ON 40°C', fill: 'var(--green)', fontSize: 10, fontFamily: 'var(--font-mono)', position: 'insideTopRight' }} />
              <ReferenceLine y={34.7} stroke="rgba(255,71,87,0.6)" strokeDasharray="4 4"
                label={{ value: 'OFF 34.7°C', fill: 'var(--red)', fontSize: 10, fontFamily: 'var(--font-mono)', position: 'insideBottomRight' }} />
              <Area type="monotone" dataKey="temp" stroke="var(--cyan)" strokeWidth={2} fill="url(#tempGrad)" dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default LiveSimulation;
