import React from 'react';
import { User, Users, BookOpen, Code2, Cpu, TestTube2, BookMarked, Layers, Wrench, FileText, ChevronRight } from 'lucide-react';

/* ── Team data ─────────────────────────────────────── */
const TEAM = [
  {
    name: 'Tanay Dubey',
    title: 'Threshold Logic, Test Plan & Data',
    icon: TestTube2,
    color: 'var(--blue)',
    colorRgb: '59,130,246',
    points: [
      'Fan ON / OFF threshold design (ADC ≥ 82 / ≤ 71)',
      'Hysteresis control logic',
      'System testing strategy',
      'Test data collection & validation',
    ],
    flow: null,
    highlight: false,
  },
  {
    name: 'Urvashi Anand',
    title: 'IEEE 754 & Floating-Point (Unit 2)',
    icon: Code2,
    color: 'var(--violet)',
    colorRgb: '139,92,246',
    points: [
      'IEEE 754 single-precision analysis',
      '35.15625 → 0x420CA000 derivation',
      '40.0390625 → 0x42202800 derivation',
      'Technical references & bibliography',
    ],
    flow: null,
    highlight: false,
  },
  {
    name: 'Vinayak Dev Tiwari',
    title: 'Unit 3 CAPP Concept Mapping',
    icon: Layers,
    color: 'var(--amber)',
    colorRgb: '251,191,36',
    points: [
      'Instruction types & instruction cycle',
      'Micro-operations & program control',
      'RISC vs CISC architecture comparison',
      'Pipelining & control unit concepts',
    ],
    flow: null,
    highlight: false,
  },
  {
    name: 'Vikas Pal',
    title: 'Hardware, Circuit, Relay/Fan Integration',
    icon: Wrench,
    color: 'var(--cyan)',
    colorRgb: '0,229,194',
    points: [
      'Physical circuit design & breadboard build',
      'LM35 sensor wiring to ATmega328P A0',
      'Relay module integration (D7 control pin)',
      'DC fan actuation via separate 12V supply',
    ],
    flow: ['LM35', 'ATmega328P', 'Relay', 'Fan'],
    highlight: false,
  },
  {
    name: 'Vishal Gangwar',
    title: 'Documentation & System Design',
    icon: FileText,
    color: 'var(--green)',
    colorRgb: '16,217,138',
    points: [
      'Project report writing & formatting',
      'System architecture documentation',
      'Block diagram & flow chart preparation',
      'System design updates & revisions',
    ],
    flow: null,
    highlight: false,
  },
];

/* ── Individual Member Card ─────────────────────────── */
const MemberCard = ({ member }) => {
  const { name, title, icon: Icon, color, colorRgb, points, flow, highlight } = member;

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.25s, box-shadow 0.25s',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>

      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.4,
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Icon bubble */}
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
          background: `rgba(${colorRgb},0.12)`,
          border: `1px solid rgba(${colorRgb},0.3)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={color} />
        </div>

        {/* Name + title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: highlight ? 'var(--text-bright)' : 'var(--text-bright)',
            marginBottom: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {name}
            {highlight && (
              <span style={{
                padding: '1px 7px',
                borderRadius: '100px',
                background: `rgba(${colorRgb},0.15)`,
                border: `1px solid rgba(${colorRgb},0.35)`,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color,
              }}>Hardware</span>
            )}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: color,
            letterSpacing: '0.5px',
            lineHeight: 1.4,
          }}>
            {title}
          </div>
        </div>
      </div>

      {/* Responsibility bullets */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', margin: 0, padding: 0 }}>
        {points.map((pt, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <ChevronRight size={12} color={color} style={{ flexShrink: 0, marginTop: '3px', opacity: 0.8 }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>{pt}</span>
          </li>
        ))}
      </ul>

      {/* Hardware flow indicator (Vikas only) */}
      {flow && (
        <div style={{
          borderTop: `1px solid rgba(${colorRgb},0.15)`,
          paddingTop: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap',
        }}>
          {flow.map((node, i) => (
            <React.Fragment key={node}>
              <span style={{
                padding: '3px 10px',
                borderRadius: '100px',
                background: `rgba(${colorRgb},0.08)`,
                border: `1px solid rgba(${colorRgb},0.25)`,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                fontWeight: 600,
                color,
                letterSpacing: '0.5px',
              }}>
                {node}
              </span>
              {i < flow.length - 1 && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: `rgba(${colorRgb},0.5)`,
                }}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════ */
const ProjectInfo = () => {
  return (
    <section className="panel">
      <div className="panel-title">
        <BookOpen size={16} /> Project Information
      </div>

      {/* ── Project metadata ──────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        {[
          { label: 'Course', value: 'Computer Architecture and Parallel Processing (CAPP)', sub: 'CCSE0304', accent: false },
          { label: 'SDG', value: 'SDG 9 – Industry, Innovation and Infrastructure', sub: null, accent: true },
          { label: 'Group & Progress', value: null, sub: null, accent: false, custom: true },
        ].map(({ label, value, sub, accent, custom }) => (
          <div key={label} className="card">
            <div className="metric-label">{label}</div>
            {custom ? (
              <div style={{ display: 'flex', gap: '2rem', marginTop: '6px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text-bright)', lineHeight: 1 }}>89</div>
                  <div className="metric-sub" style={{ marginTop: '4px' }}>Group No.</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--green)', lineHeight: 1 }}>65%</div>
                  <div style={{ marginTop: '8px', height: '4px', width: '90px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: '65%', background: 'linear-gradient(90deg, var(--green), #a3f7bf)', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '0.88rem', fontWeight: 500, color: accent ? 'var(--cyan)' : 'var(--text-bright)', marginTop: '4px', lineHeight: 1.4 }}>
                  {value}
                </div>
                {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '3px' }}>{sub}</div>}
              </>
            )}
          </div>
        ))}
      </div>

      {/* ── Team Contributions heading ────────── */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-subtle))' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={16} color="var(--cyan)" />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--text-main)',
            }}>Team Contributions</span>
          </div>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--border-subtle), transparent)' }} />
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.6 }}>
          Individual responsibilities within the ICPS Temperature Monitoring &amp; Automatic Cooling System
        </p>
      </div>

      {/* ── 3-column row ─────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '1rem',
      }}
        className="team-row-top"
      >
        {TEAM.slice(0, 3).map(m => <MemberCard key={m.name} member={m} />)}
      </div>

      {/* ── 2-column centered row ─────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        maxWidth: '66.6%',
        margin: '0 auto',
      }}
        className="team-row-bottom"
      >
        {TEAM.slice(3).map(m => <MemberCard key={m.name} member={m} />)}
      </div>

      {/* ── Footer note ──────────────────────── */}
      <div style={{
        marginTop: '1.75rem',
        padding: '12px 20px',
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(0,229,194,0.04)',
        border: '1px solid rgba(0,229,194,0.12)',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        color: 'var(--text-dim)',
        letterSpacing: '0.5px',
      }}>
        All five contributions combine to form the complete cyber-physical system.
      </div>

      {/* Mobile responsiveness */}
      <style>{`
        @media (max-width: 900px) {
          .team-row-top { grid-template-columns: 1fr !important; }
          .team-row-bottom { grid-template-columns: 1fr !important; max-width: 100% !important; }
        }
        @media (min-width: 901px) and (max-width: 1100px) {
          .team-row-top { grid-template-columns: 1fr 1fr !important; }
          .team-row-bottom { grid-template-columns: 1fr 1fr !important; max-width: 100% !important; }
        }
      `}</style>
    </section>
  );
};

export default ProjectInfo;
