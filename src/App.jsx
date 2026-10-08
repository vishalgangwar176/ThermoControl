import React, { useState, useEffect, useRef } from 'react';
import LiveSimulation from './components/LiveSimulation';
import CAPPArchitecture from './components/CAPPArchitecture';
import ProjectInfo from './components/ProjectInfo';
import HardwareVisualization from './components/HardwareVisualization';
import HardwareConnection from './components/HardwareConnection';
import DataLogging from './components/DataLogging';
import { MonitorPlay, Monitor } from 'lucide-react';
import './App.css';

function App() {
  const [mode, setMode] = useState('SIMULATION');
  const [hardwareStatus, setHardwareStatus] = useState('DISCONNECTED');
  const [connectionError, setConnectionError] = useState(null);
  const [presentationMode, setPresentationMode] = useState(false);

  const [temperature, setTemperature] = useState(30.0);
  const [adcValue, setAdcValue] = useState(61);
  const [fanOn, setFanOn] = useState(false);
  const [simRunning, setSimRunning] = useState(false);

  const [logData, setLogData] = useState([]);
  const wsRef = useRef(null);

  // Simulation control logic with hysteresis
  useEffect(() => {
    if (mode === 'HARDWARE') return;
    const adc = Math.round((temperature * 256) / 125);
    setAdcValue(adc);
    setFanOn(prev => {
      if (adc >= 82) return true;
      if (adc <= 71) return false;
      return prev;
    });

    if (simRunning) {
      setLogData(prev => {
        const entry = {
          time: new Date().toLocaleTimeString(),
          adc,
          temp: temperature.toFixed(2),
          fan: adc >= 82 ? 'ON' : adc <= 71 ? 'OFF' : (prev[prev.length - 1]?.fan || 'OFF'),
          relay: adc >= 82 ? 'ACTIVE' : adc <= 71 ? 'INACTIVE' : (prev[prev.length - 1]?.relay || 'INACTIVE'),
        };
        const next = [...prev, entry];
        return next.length > 100 ? next.slice(-100) : next;
      });
    }
  }, [temperature, mode, simRunning]);

  // Auto simulation drift
  useEffect(() => {
    let iv;
    if (mode === 'SIMULATION' && simRunning) {
      iv = setInterval(() => {
        setTemperature(prev => {
          const up = Math.random() * 0.6 + 0.2;
          const down = Math.random() * 0.8 + 1.2;
          let t = prev + (fanOn ? -down : up);
          return Number(Math.max(20, Math.min(50, t)).toFixed(2));
        });
      }, 1000);
    }
    return () => clearInterval(iv);
  }, [simRunning, fanOn, mode]);

  // WebSocket message handler for hardware mode
  useEffect(() => {
    if (mode === 'SIMULATION' || !wsRef.current) return;
    wsRef.current.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data);
        if (d.type === 'STATUS') setHardwareStatus(d.status);
        else if (d.type === 'DATA') {
          const temp = parseFloat(d.TEMP);
          const adc = parseInt(d.ADC);
          setTemperature(temp);
          setAdcValue(adc);
          setFanOn(d.FAN === 'ON');
          setLogData(prev => {
            const next = [...prev, {
              time: new Date().toLocaleTimeString(), adc, temp: temp.toFixed(2),
              fan: d.FAN, relay: d.RELAY, s1: d.S1, s2: d.S2, s3: d.S3, s4: d.S4
            }];
            return next.length > 100 ? next.slice(-100) : next;
          });
        } else if (d.type === 'ERROR') setConnectionError(d.message);
      } catch {}
    };
  }, [mode, hardwareStatus]);

  return (
    <div className="dashboard-container">
      {/* ── Header ─────────────────────────────── */}
      <header className="header">
        <button
          className={`btn ${presentationMode ? 'active' : ''}`}
          onClick={() => setPresentationMode(p => !p)}
          style={{
            position: 'absolute', top: '1.5rem', right: 0,
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          {presentationMode ? <Monitor size={14} /> : <MonitorPlay size={14} />}
          Presentation Mode
        </button>

        <div className="metadata">CAPP PBL Progress Report – II &nbsp;|&nbsp; BTech CSE &nbsp;|&nbsp; Group 89</div>
        <h1 className="title">Industrial Cyber-Physical System</h1>
        <div className="subtitle">Temperature Monitoring &amp; Automatic Cooling System</div>
      </header>

      {/* ── Main Sections ───────────────────────── */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

        {!presentationMode && (
          <HardwareConnection
            mode={mode} setMode={setMode}
            wsRef={wsRef}
            hardwareStatus={hardwareStatus} setHardwareStatus={setHardwareStatus}
            connectionError={connectionError} setConnectionError={setConnectionError}
          />
        )}

        <LiveSimulation
          mode={mode}
          temperature={temperature} setTemperature={setTemperature}
          adcValue={adcValue}
          fanOn={fanOn}
          simRunning={simRunning} setSimRunning={setSimRunning}
          hardwareStatus={hardwareStatus}
        />

        <HardwareVisualization fanOn={fanOn} adcValue={adcValue} temperature={temperature} />

        <DataLogging logData={logData} setLogData={setLogData} />

        <CAPPArchitecture />

        {!presentationMode && <ProjectInfo />}
      </main>
    </div>
  );
}

export default App;
