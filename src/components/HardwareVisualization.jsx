import React, { useState } from 'react';
import { Thermometer, Cpu, Zap, Wind, RefreshCw, Info } from 'lucide-react';

/* ── Pipeline Step ─────────────────────────────────── */
const PipelineStep = ({ icon: Icon, label, value, sub, color = 'var(--cyan)', active = true, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: 'rgba(0,0,0,0.3)',
      border: `1px solid ${active ? `rgba(${color === 'var(--cyan)' ? '0,229,194' : color === 'var(--green)' ? '16,217,138' : color === 'var(--red)' ? '255,71,87' : '255,255,255'},0.25)` : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-sm)',
      padding: '14px 12px',
      textAlign: 'center',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      position: 'relative',
      flex: 1,
    }}
  >
    <Icon size={22} color={active ? color : 'var(--text-dim)'} style={{ margin: '0 auto 8px', display: 'block' }} />
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', marginBottom: '4px' }}>
      {label}
    </div>
    {value && (
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: active ? color : 'var(--text-dim)' }}>
        {value}
      </div>
    )}
    {sub && (
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '3px' }}>
        {sub}
      </div>
    )}
  </div>
);

const Arrow = ({ fanOn }) => (
  <div style={{
    display: 'flex', alignItems: 'center', color: fanOn ? 'var(--cyan)' : 'var(--text-dim)',
    fontSize: '0.9rem', flexShrink: 0, opacity: fanOn ? 1 : 0.3, transition: 'all 0.4s'
  }}>→</div>
);

/* ── Component Info Panel ──────────────────────────── */
const componentInfoMap = {
  lm35: {
    title: 'LM35 Temperature Sensor',
    body: 'A precision analog temperature sensor with a linear output of 10 mV per °C. Requires no external calibration and operates from a single 5V supply.',
    color: 'var(--red)'
  },
  adc: {
    title: '10-bit ADC (ATmega328P)',
    body: 'The built-in ADC converts the 0–5V LM35 analog voltage to a 0–1023 integer. 4 samples are taken and averaged using a bitwise right-shift (sum >> 2) for noise rejection.',
    color: 'var(--blue)'
  },
  mcu: {
    title: 'ATmega328P Microcontroller',
    body: 'An 8-bit AVR RISC processor that performs the threshold comparison and drives the relay control pin (D7). T = ADC × 125 / 256. A 32-bit intermediate is required as 1023 × 125 = 127,875 exceeds 16-bit range.',
    color: '#fff'
  },
  relay: {
    title: '5V Relay Module',
    body: 'An electromechanical switch. The ATmega328P drives the relay coil (via a transistor + flyback diode). The relay contacts physically switch the fan\'s 12V supply path.',
    color: 'var(--amber)'
  },
  fan: {
    title: 'DC Cooling Fan',
    body: 'The final actuator. Powered by a separate 12V supply through the relay contacts. When active, it forces air circulation to reduce ambient temperature, closing the cyber-physical feedback loop.',
    color: 'var(--cyan)'
  },
};

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════ */
const HardwareVisualization = ({ fanOn, adcValue, temperature }) => {
  const [selected, setSelected] = useState(null);
  const toggleInfo = (key) => setSelected(prev => prev === key ? null : key);
  const info = selected ? componentInfoMap[selected] : null;

  // Cyber-physical loop angle tracking
  const steps = [
    { id: 'temp', label: 'Temperature', icon: Thermometer, color: 'var(--red)' },
    { id: 'sensor', label: 'LM35 Sensor', icon: Thermometer, color: 'var(--orange)' },
    { id: 'adc', label: 'ADC Sample', icon: Cpu, color: 'var(--blue)' },
    { id: 'process', label: 'Processing', icon: Cpu, color: 'var(--violet)' },
    { id: 'decision', label: 'Decision', icon: Zap, color: 'var(--amber)' },
    { id: 'relay', label: 'Relay', icon: Zap, color: fanOn ? 'var(--green)' : 'var(--text-dim)' },
    { id: 'fan', label: 'Fan', icon: Wind, color: fanOn ? 'var(--cyan)' : 'var(--text-dim)' },
    { id: 'airflow', label: 'Airflow', icon: RefreshCw, color: fanOn ? 'var(--cyan)' : 'var(--text-dim)' },
  ];

  return (
    <section className="panel">
      <div className="panel-title">
        <Zap size={16} />
        System Architecture & Hardware Circuit
      </div>

      <div className="grid-2">

        {/* ── Left: CPS Feedback Loop ─────────────── */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1.5rem', textAlign: 'center' }}>
            Cyber-Physical Feedback Loop
          </div>

          {/* Circular diagram using SVG */}
          <div style={{ position: 'relative', width: '260px', height: '260px' }}>
            <svg viewBox="0 0 260 260" style={{ position: 'absolute', inset: 0 }}>
              {/* Outer ring */}
              <circle cx="130" cy="130" r="110" fill="none" stroke="rgba(0,229,194,0.08)" strokeWidth="1" />
              <circle cx="130" cy="130" r="110" fill="none" stroke="rgba(0,229,194,0.15)" strokeWidth="1.5"
                strokeDasharray="8 6" className={fanOn ? 'flow-line' : ''} />
              {/* Inner glow */}
              <circle cx="130" cy="130" r="60" fill="rgba(0,229,194,0.02)" stroke="rgba(0,229,194,0.05)" strokeWidth="1" />
            </svg>

            {/* Center label */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'var(--cyan)', letterSpacing: '2px' }}>ICPS</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '2px' }}>CPS Loop</div>
            </div>

            {/* Orbit icons */}
            {steps.map((step, i) => {
              const angle = (i / steps.length) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const r = 105;
              const x = 130 + r * Math.cos(rad);
              const y = 130 + r * Math.sin(rad);
              return (
                <div
                  key={step.id}
                  style={{
                    position: 'absolute',
                    left: `${x}px`, top: `${y}px`,
                    transform: 'translate(-50%, -50%)',
                    width: '36px', height: '36px',
                    borderRadius: '50%',
                    background: 'var(--bg-card)',
                    border: `1px solid ${step.color === 'var(--text-dim)' ? 'var(--border-subtle)' : `rgba(${step.color.includes('cyan') ? '0,229,194' : step.color.includes('green') ? '16,217,138' : step.color.includes('red') ? '255,71,87' : step.color.includes('blue') ? '59,130,246' : step.color.includes('violet') ? '139,92,246' : step.color.includes('amber') ? '251,191,36' : '255,127,63'},0.4)`}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: fanOn && step.color !== 'var(--text-dim)' ? `0 0 10px ${step.color}30` : 'none',
                    transition: 'all 0.5s ease',
                  }}
                >
                  <step.icon size={14} color={step.color} className={step.id === 'fan' && fanOn ? 'anim-spin' : ''} />
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            Sensor → ADC → MCU → Relay → Fan → Airflow → Temperature↻
          </div>
        </div>

        {/* ── Right: Interactive Circuit ───────────── */}
        <div className="card">
          <div style={{
            display: 'flex', gap: '8px', alignItems: 'center',
            marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)'
          }}>
            <Info size={13} color="var(--cyan)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Interactive Hardware Pipeline · Click to Inspect
            </span>
          </div>

          {/* Signal Pipeline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <PipelineStep icon={Thermometer} label="LM35" value={`${(temperature * 10).toFixed(0)} mV`} sub="10 mV/°C" color="var(--red)" onClick={() => toggleInfo('lm35')} />
            <Arrow fanOn={true} />
            <PipelineStep icon={Cpu} label="ADC" value={adcValue} sub="10-bit" color="var(--blue)" onClick={() => toggleInfo('adc')} />
            <Arrow fanOn={true} />
            <PipelineStep icon={Cpu} label="MCU" value="D7" sub={`${fanOn ? 'HIGH' : 'LOW'}`} color="var(--text-bright)" onClick={() => toggleInfo('mcu')} />
            <Arrow fanOn={fanOn} />
            <PipelineStep icon={Zap} label="Relay" value={fanOn ? 'CLOSED' : 'OPEN'} sub="5V coil" color="var(--amber)" active={fanOn} onClick={() => toggleInfo('relay')} />
            <Arrow fanOn={fanOn} />
            <PipelineStep icon={Wind} label="Fan" value={fanOn ? 'ON' : 'OFF'} sub="12V supply" color="var(--cyan)" active={fanOn} onClick={() => toggleInfo('fan')} />
          </div>

          {/* Info box */}
          {info ? (
            <div style={{
              padding: '14px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(0,0,0,0.4)', border: `1px solid rgba(${info.color === 'var(--red)' ? '255,71,87' : info.color === 'var(--cyan)' ? '0,229,194' : '255,255,255'},0.15)`,
              animation: 'fade-in-up 0.25s ease-out'
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-bright)', marginBottom: '6px' }}>
                {info.title}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.7 }}>
                {info.body}
              </div>
            </div>
          ) : (
            <div style={{
              padding: '14px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                ⚠ MCU controls relay input only. Fan is powered by separate 12V supply.
              </div>
            </div>
          )}

          {/* Connection lines (schematic-style) */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div className="code-block" style={{ fontSize: '0.75rem' }}>
              <div><span className="code-comment">// Control Flow</span></div>
              <div>A0 (LM35) → ATmega328P <span className="code-keyword">ADC</span></div>
              <div>D7 (HIGH/LOW) → Relay <span className="code-keyword">IN</span></div>
              <div>Relay <span className="code-keyword">NO</span> → Fan+  <span className="code-comment">// 12V supply</span></div>
              <div>Relay <span className="code-keyword">COM</span> → 12V GND</div>
              <div>Flyback diode across relay coil</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HardwareVisualization;
