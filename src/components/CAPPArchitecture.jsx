import React, { useState } from 'react';
import { Cpu, Binary, Network, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';

/* ── Division Steps ─────────────────────────────────── */
const DIV_STEPS = [
  {
    step: 0, label: 'Initial State',
    desc: 'Set A=0, Q=Dividend (35), M=Divisor (10)',
    A: '00000000', Q: '00100011', Qlabel: '(35)', M: '00001010',
    note: 'Dividend = 35, Divisor = 10, n = 6 iterations'
  },
  {
    step: 1, label: 'Shift Left (AQ)',
    desc: 'Shift the combined AQ register left by 1 bit',
    A: '00000000', Q: '01000110', Qlabel: '', M: '00001010',
    note: 'A:Q shifted left, MSB of Q moves into LSB of A'
  },
  {
    step: 2, label: 'Subtract M from A',
    desc: 'A ← A − M',
    A: '11110110', Q: '01000110', Qlabel: '', M: '00001010',
    note: 'Result is negative (MSB = 1), must restore'
  },
  {
    step: 3, label: 'Restore, Q[0] = 0',
    desc: 'A < 0 → Restore A by adding M back. Set Q[LSB] = 0',
    A: '00000000', Q: '01000110', Qlabel: '', M: '00001010',
    note: 'Quotient bit = 0 for this step'
  },
  {
    step: 4, label: 'Remaining Steps…',
    desc: 'Steps 2–6 repeat the shift-subtract-restore cycle',
    A: '00000011', Q: '00000011', Qlabel: '(Q→3)', M: '00001010',
    note: 'After 6 iterations: A holds Remainder, Q holds Quotient'
  },
  {
    step: 5, label: 'Final Result',
    desc: '35 ÷ 10 = Quotient 3, Remainder 5',
    A: '00000101', Q: '00000011', Qlabel: '(Q=3, A=5)', M: '00001010',
    note: 'Verify: 35 = 3 × 10 + 5 ✓'
  },
];

/* ── Section Card ───────────────────────────────────── */
const SubCard = ({ title, icon: Icon, children }) => (
  <div className="card">
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)'
    }}>
      <Icon size={13} color="var(--cyan)" />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
        {title}
      </span>
    </div>
    {children}
  </div>
);

/* ── Register Row ───────────────────────────────────── */
const Reg = ({ name, value, label }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)'
  }}>
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
      color: 'var(--text-dim)', width: '20px'
    }}>{name}:</span>
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.82rem', letterSpacing: '2px',
      color: 'var(--cyan)'
    }}>{value}</span>
    {label && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--amber)' }}>{label}</span>}
  </div>
);

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════ */
const CAPPArchitecture = () => {
  const [divStep, setDivStep] = useState(0);
  const current = DIV_STEPS[divStep];

  return (
    <section className="panel">
      <div className="panel-title">
        <Cpu size={16} />
        CAPP Analysis — Architecture Mapping
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
        Mapping the physical ICPS project to Computer Architecture &amp; Parallel Processing concepts.
      </p>

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>

        {/* ── ALU / Project Mapping ─────────────── */}
        <SubCard title="Project ↔ Architecture Mapping" icon={Cpu}>
          {[
            ['ALU', 'ADC × 125 / 256'],
            ['SHIFT OPS', 'sum >> 2  (avg)  ·  >> 8  (÷256)'],
            ['LOGIC', 'Relay control bitmask'],
            ['COMPARISON', 'ADC − threshold (82 / 71)'],
            ['FLAGS', 'Zero · Carry · Negative'],
            ['BRANCH', 'Threshold → fan control PC jump'],
          ].map(([k, v]) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
              gap: '10px'
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>
                {k}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'right' }}>
                {v}
              </span>
            </div>
          ))}

          <div style={{
            marginTop: '1rem', padding: '12px',
            background: 'rgba(255,127,63,0.07)', borderLeft: '3px solid var(--orange)',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            fontSize: '0.78rem', lineHeight: 1.7, color: 'var(--text-dim)'
          }}>
            <strong style={{ color: 'var(--orange)' }}>32-bit Intermediate Required</strong><br />
            Max: 1023 × 125 = 127,875 — exceeds 16-bit unsigned max (65,535).
            The ATmega328P has an 8-bit ALU; multi-byte arithmetic is handled in software.
          </div>
        </SubCard>

        {/* ── Instruction Cycle ─────────────────── */}
        <SubCard title="ATmega328P · Instruction Execution" icon={Cpu}>
          {/* Cycle stages */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {['FETCH', 'DECODE', 'OP FETCH', 'EXECUTE', 'FLAGS', 'INT CHECK'].map((s, i) => (
              <div key={s} style={{
                flex: '1 1 auto', minWidth: '60px',
                padding: '5px 6px', textAlign: 'center',
                background: 'rgba(0,229,194,0.06)', border: '1px solid rgba(0,229,194,0.15)',
                borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                color: 'var(--cyan)', letterSpacing: '0.5px'
              }}>
                {s}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1rem' }}>
            {[
              'LOAD R1, ADC_AVG',
              'COMPARE R1, #82',
              'BRANCH_LT FAN_CHECK',
              'SET_BIT PORTD,2',
            ].map((instr, i) => (
              <div key={instr} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '7px 10px', borderRadius: 'var(--radius-sm)',
                background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)', minWidth: '16px' }}>
                  {i + 1}.
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-code)' }}>
                  {instr}
                </span>
              </div>
            ))}
          </div>

          <div className="code-block" style={{ fontSize: '0.75rem' }}>
            <div><span className="code-comment">// Fetch</span></div>
            <div>T0: MAR ← PC</div>
            <div>T1: MDR ← M[MAR];  PC ← PC+1</div>
            <div>T2: IR ← MDR;  T3: Decode</div>
            <div className="code-comment" style={{ marginTop: '6px' }}>// Compare → Execute</div>
            <div>ALU ← R1 − 82;  FLAGS ← result</div>
            <div className="code-comment" style={{ marginTop: '6px' }}>// Branch</div>
            <div>PC ← target  <span className="code-comment">// if condition met</span></div>
          </div>
        </SubCard>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>

        {/* ── Restoring Division ────────────────── */}
        <SubCard title="Restoring Division · 35 ÷ 10" icon={Binary}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '10px'
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--cyan)' }}>
                Step {current.step + 1}/{DIV_STEPS.length}: {current.label}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="btn" onClick={() => setDivStep(s => Math.max(0, s - 1))} style={{ padding: '4px 8px' }}>
                  <ChevronLeft size={12} />
                </button>
                <button className="btn" onClick={() => setDivStep(s => Math.min(DIV_STEPS.length - 1, s + 1))} style={{ padding: '4px 8px', borderColor: 'var(--cyan)', color: 'var(--cyan)' }}>
                  <ChevronRight size={12} />
                </button>
                <button className="btn" onClick={() => setDivStep(0)} style={{ padding: '4px 8px' }}>
                  <RotateCcw size={12} />
                </button>
              </div>
            </div>

            <div style={{
              padding: '10px 14px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)',
              marginBottom: '10px'
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                {current.desc}
              </div>
              <Reg name="A" value={current.A} />
              <Reg name="Q" value={current.Q} label={current.Qlabel} />
              <Reg name="M" value={current.M} />
            </div>

            <div style={{
              padding: '8px 12px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)',
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)'
            }}>
              {current.note}
            </div>
          </div>

          {/* Step progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {DIV_STEPS.map((_, i) => (
              <div
                key={i}
                onClick={() => setDivStep(i)}
                style={{
                  width: i === divStep ? '20px' : '6px', height: '6px',
                  borderRadius: '3px',
                  background: i === divStep ? 'var(--cyan)' : 'rgba(255,255,255,0.12)',
                  cursor: 'pointer', transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          {divStep === DIV_STEPS.length - 1 && (
            <div style={{
              marginTop: '1rem', padding: '10px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(16,217,138,0.07)', border: '1px solid rgba(16,217,138,0.25)',
              fontFamily: 'var(--font-mono)', fontSize: '0.78rem', textAlign: 'center', color: 'var(--green)'
            }}>
              35 = 3 × 10 + 5 ✓
            </div>
          )}
        </SubCard>

        {/* ── IEEE 754 + RISC/Flynn ─────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <SubCard title="IEEE 754 Floating-Point (Display Only)" icon={Binary}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1rem', lineHeight: 1.6 }}>
              Floating-point is used for display/logging only. Actual threshold control uses integer ADC counts.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '6px' }}>35.15625</div>
                <div className="code-block" style={{ fontSize: '0.68rem', padding: '8px' }}>
                  <div>1.0001100101 × 2⁵</div>
                  <div>Sign=0  Exp=132 (10000100)</div>
                  <div style={{ color: 'var(--amber)', fontWeight: 700, marginTop: '4px' }}>0x420CA000</div>
                </div>
              </div>
              <div style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '6px' }}>40.0390625</div>
                <div className="code-block" style={{ fontSize: '0.68rem', padding: '8px' }}>
                  <div>1.0100000001 × 2⁵</div>
                  <div>Sign=0  Exp=132 (10000100)</div>
                  <div style={{ color: 'var(--amber)', fontWeight: 700, marginTop: '4px' }}>0x42202800</div>
                </div>
              </div>
            </div>
          </SubCard>

          <SubCard title="Architecture & Flynn Classification" icon={Network}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
              <div style={{
                flex: 1, padding: '12px', textAlign: 'center',
                background: 'rgba(0,229,194,0.05)', border: '1px solid rgba(0,229,194,0.2)',
                borderRadius: 'var(--radius-sm)'
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--cyan)', marginBottom: '4px' }}>SISD</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)' }}>Single Instruction<br />Single Data</div>
                <div className="badge badge-cyan" style={{ margin: '8px auto 0', display: 'inline-flex' }}>This Project</div>
              </div>
              <div style={{
                flex: 1, padding: '12px', textAlign: 'center',
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)', opacity: 0.5
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '4px' }}>SIMD</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)' }}>Multi-sensor<br />Conceptual only</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                ['RISC', 'CISC'],
                ['Hardwired', 'Microprogrammed'],
                ['Horizontal μ', 'Vertical μ'],
              ].map(([a, b]) => (
                <div key={a} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px',
                  alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <span className="badge badge-cyan" style={{ justifySelf: 'start' }}>{a}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)' }}>vs</span>
                  <span className="badge" style={{
                    justifySelf: 'end',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-dim)', padding: '3px 10px', borderRadius: '100px',
                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600,
                    letterSpacing: '1px', textTransform: 'uppercase'
                  }}>{b}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              8-bit AVR RISC · Fixed-length instructions · Single-cycle (most) · 2-stage pipeline · Taken branch = +1 cycle
            </div>
          </SubCard>
        </div>
      </div>
    </section>
  );
};

export default CAPPArchitecture;
