import { useState } from 'react';

export default function ApiKeyDemo({ addLog }: { addLog: (msg: string, source: 'client'|'server', type?: 'success'|'error'|'info') => void }) {
  const [apiKey, setApiKey] = useState('demo_key_9f8d7c');
  const [validKeys, setValidKeys] = useState<string[]>(['demo_key_9f8d7c']);

  const handleGenerateKey = () => {
    addLog(`[Developer Portal] Requesting new API Key...`, 'client', 'info');
    setTimeout(() => {
      const newKey = 'live_' + Math.random().toString(36).substring(2, 12);
      setValidKeys(prev => [...prev, newKey]);
      setApiKey(newKey);
      addLog(`[Server] Generated API Key: ${newKey}`, 'server', 'success');
      addLog(`[Server] Stored hashed key in Database`, 'server', 'info');
    }, 500);
  };

  const handleRevokeKey = (keyToRevoke: string) => {
    addLog(`[Developer Portal] Revoking API Key ${keyToRevoke}...`, 'client', 'info');
    setTimeout(() => {
      setValidKeys(prev => prev.filter(k => k !== keyToRevoke));
      addLog(`[Server] API Key revoked and removed from Database`, 'server', 'success');
    }, 400);
  };
  
  const handleFetchProtected = () => {
    addLog(`GET /api/v1/data\nx-api-key: ${apiKey}`, 'client', 'info');
    
    setTimeout(() => {
      addLog(`[DB Query] Validating API Key: ${apiKey}`, 'server', 'info');
      
      setTimeout(() => {
        if (validKeys.includes(apiKey)) {
          addLog(`[Success] API Key valid! Belongs to user: Application A`, 'server', 'success');
          addLog('HTTP 200 OK - { "data": "Secret API Data" }', 'server', 'info');
        } else {
          addLog('HTTP 401 Unauthorized - Invalid API Key', 'server', 'error');
        }
      }, 600);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ color: 'var(--text-secondary)' }}>
        API Keys are long-lived tokens often used for Server-to-Server communication. They are typically sent in custom HTTP headers (like `x-api-key`). They don't have expiration by default and must be explicitly revoked.
      </p>

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Developer Dashboard</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Generate and manage long-lived API keys to authorize server-to-server requests.</p>
        <button className="btn" style={{ background: 'var(--primary)', marginBottom: '1rem' }} onClick={handleGenerateKey}>Generate New API Key</button>
        
        <div style={{ marginTop: '0.5rem' }}>
          <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Active Keys ({validKeys.length})</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {validKeys.map(key => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <code style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{key}</code>
                <button 
                  onClick={() => handleRevokeKey(key)}
                  style={{ background: 'transparent', border: '1px solid #ff4a4a', color: '#ff4a4a', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', transition: 'all 0.2s' }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 74, 74, 0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Revoke
                </button>
              </div>
            ))}
            {validKeys.length === 0 && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '0.5rem 0' }}>No active keys</div>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px' }}>
        <h4 style={{ marginBottom: '1rem' }}>Client Application</h4>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Request Authorization Header (x-api-key)</label>
          <input className="input-field" value={apiKey} onChange={e => setApiKey(e.target.value)} />
        </div>
        <button className="btn" style={{ background: 'var(--secondary)' }} onClick={handleFetchProtected}>Make API Request</button>
      </div>
    </div>
  );
}
