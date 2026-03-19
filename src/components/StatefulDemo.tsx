import React, { useState } from 'react';

export default function StatefulDemo({ addLog }: { addLog: (msg: string, source: 'client'|'server', type?: 'success'|'error'|'info') => void }) {
  const [sessionCookie, setSessionCookie] = useState<string | null>(null);
  const [username, setUsername] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    addLog(`POST /login (username: ${username}, password: ${password})`, 'client', 'info');
    
    // Simulate Server processing
    setTimeout(() => {
      addLog(`[DB Query] Validating credentials for ${username}`, 'server', 'info');
      
      setTimeout(() => {
        const sessionId = "sess_" + Math.random().toString(36).substring(2, 10) + Date.now();
        addLog(`[Success] Credentials valid. Created Session ID: ${sessionId} in MemoryStore`, 'server', 'success');
        addLog(`HTTP 200 OK - Set-Cookie: session_id=${sessionId}; HttpOnly`, 'server', 'info');
        
        setSessionCookie(sessionId);
        addLog(`[Browser] Received Cookie. Automatically storing session_id=${sessionId}`, 'client', 'success');
        setLoading(false);
      }, 800);
    }, 600);
  };

  const handleFetchProtected = () => {
    addLog(`GET /protected-data (Cookie: session_id=${sessionCookie})`, 'client', 'info');
    
    setTimeout(() => {
      if (!sessionCookie) {
        addLog('HTTP 401 Unauthorized - No session cookie found', 'server', 'error');
        return;
      }
      
      addLog(`[MemoryStore] Lookup Session ID: ${sessionCookie}`, 'server', 'info');
      
      setTimeout(() => {
        addLog(`[Success] Session found. User is authenticated.`, 'server', 'success');
        addLog('HTTP 200 OK - { "data": "Secret Stateful Data" }', 'server', 'info');
      }, 600);
    }, 600);
  };

  const handleLogout = () => {
    addLog(`POST /logout (Cookie: session_id=${sessionCookie})`, 'client', 'info');
    setTimeout(() => {
      addLog(`[MemoryStore] Destroying Session ID: ${sessionCookie}`, 'server', 'info');
      addLog(`HTTP 200 OK - Set-Cookie: session_id=; Max-Age=0 (Cleared)`, 'server', 'success');
      setSessionCookie(null);
      addLog(`[Browser] Cookie cleared.`, 'client', 'info');
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ color: 'var(--text-secondary)' }}>
        Stateful authentication uses a Session ID stored on the server (e.g., in Redis or memory) and an HTTP-only cookie on the client. 
        The server must remember every active session.
      </p>

      {!sessionCookie ? (
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '1rem' }}>Login</h4>
          <input className="input-field" value={username} onChange={e => setUsername(e.target.value)} style={{ marginBottom: '0.5rem' }} />
          <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: '1rem' }} />
          <button className="btn" onClick={handleLogin} disabled={loading}>
            {loading ? 'Authenticating...' : 'Submit Login'}
          </button>
        </div>
      ) : (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', padding: '1.5rem', borderRadius: '8px' }}>
          <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Authenticated!</h4>
          <p style={{ fontSize: '0.85rem', marginBottom: '1rem', wordBreak: 'break-all' }}>
            <strong>Browser Cookie:</strong> session_id={sessionCookie}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ background: 'var(--secondary)' }} onClick={handleFetchProtected}>Fetch Protected Resource</button>
            <button className="btn" style={{ background: 'var(--error)' }} onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}
