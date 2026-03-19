import { useState } from 'react';
import './index.css';

import StatefulDemo from './components/StatefulDemo';
import StatelessDemo from './components/StatelessDemo';
import ApiKeyDemo from './components/ApiKeyDemo';
import OAuthDemo from './components/OAuthDemo';
import LogViewer, { type LogEntry } from './components/LogViewer';

function App() {
  const [activeFlow, setActiveFlow] = useState('stateful');
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (message: string, source: 'client' | 'server', type?: 'success' | 'error' | 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      time: new Date().toLocaleTimeString(),
      source,
      message,
      type
    };
    setLogs(prev => [...prev, newLog]);
  };

  const clearLogs = () => setLogs([]);

  const renderActiveFlow = () => {
    switch (activeFlow) {
      case 'stateful': return <StatefulDemo addLog={addLog} />;
      case 'stateless': return <StatelessDemo addLog={addLog} />;
      case 'apikey': return <ApiKeyDemo addLog={addLog} />;
      case 'oauth': return <OAuthDemo addLog={addLog} />;
      default: return null;
    }
  };

  return (
    <div className="layout-container">
      {/* Interaction Pane */}
      <div className="pane">
        <div className="pane-header">
          <h2 style={{ color: 'var(--text-primary)' }}>Authentication Explorer</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Interact with different authentication flows.</p>
        </div>
        <div className="glass-panel pane-content" style={{ overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button className={`btn ${activeFlow === 'stateful' ? 'active' : ''}`} onClick={() => setActiveFlow('stateful')} style={{ opacity: activeFlow === 'stateful' ? 1 : 0.6 }}>Stateful</button>
            <button className={`btn ${activeFlow === 'stateless' ? 'active' : ''}`} onClick={() => setActiveFlow('stateless')} style={{ opacity: activeFlow === 'stateless' ? 1 : 0.6 }}>Stateless (JWT)</button>
            <button className={`btn ${activeFlow === 'apikey' ? 'active' : ''}`} onClick={() => setActiveFlow('apikey')} style={{ opacity: activeFlow === 'apikey' ? 1 : 0.6 }}>API Key</button>
            <button className={`btn ${activeFlow === 'oauth' ? 'active' : ''}`} onClick={() => setActiveFlow('oauth')} style={{ opacity: activeFlow === 'oauth' ? 1 : 0.6 }}>OAuth 2.0</button>
          </div>
          
          <div className="active-flow-container" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <h3 style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              {activeFlow === 'stateful' && 'Stateful (Session) Flow'}
              {activeFlow === 'stateless' && 'Stateless (JWT) Flow'}
              {activeFlow === 'apikey' && 'API Key Flow'}
              {activeFlow === 'oauth' && 'OAuth 2.0 Flow'}
            </h3>
            {renderActiveFlow()}
          </div>
        </div>
      </div>

      {/* Explanation / Log Pane */}
      <div className="pane">
        <div className="pane-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Live Explanation</h2>
            <p style={{ color: 'var(--text-secondary)' }}>See what happens under the hood.</p>
          </div>
          <button className="btn" onClick={clearLogs} style={{ background: 'transparent', border: '1px solid var(--surface-border)', padding: '0.5rem 1rem' }}>Clear Logs</button>
        </div>
        <LogViewer logs={logs} />
      </div>
    </div>
  );
}

export default App;
