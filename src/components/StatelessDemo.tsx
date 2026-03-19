import React, { useState } from 'react';

export default function StatelessDemo({ addLog }: { addLog: (msg: string, source: 'client'|'server', type?: 'success'|'error'|'info') => void }) {
  const [jwt, setJwt] = useState<string | null>(null);
  const [username, setUsername] = useState('user@example.com');
  const [password, setPassword] = useState('password123');

  const createMockJWT = () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ sub: username, exp: Date.now() + 3600000 }));
    const signature = btoa("mock_signature_hash");
    return `${header}.${payload}.${signature}`;
  };

  const handleLogin = () => {
    addLog(`POST /login (username: ${username}, password: ${password})`, 'client', 'info');
    
    setTimeout(() => {
      addLog(`[DB Query] Validating credentials for ${username}`, 'server', 'info');
      
      setTimeout(() => {
        const token = createMockJWT();
        addLog(`[Success] Credentials valid. Server stateless, not storing session.`, 'server', 'success');
        addLog(`[JWT] Signing Token: Header(alg:HS256) + Payload(sub:${username}) + SecretKey`, 'server', 'info');
        addLog(`HTTP 200 OK - { "token": "${token}" }`, 'server', 'info');
        
        setJwt(token);
        addLog(`[Browser] Received Token. Saving to LocalStorage/Memory.`, 'client', 'success');
      }, 800);
    }, 600);
  };

  const handleFetchProtected = () => {
    if (!jwt) {
      addLog(`GET /protected-data (No Authorization header)`, 'client', 'error');
      setTimeout(() => addLog('HTTP 401 Unauthorized - Missing Token', 'server', 'error'), 400);
      return;
    }

    addLog(`GET /protected-data\nAuthorization: Bearer ${jwt.substring(0, 20)}...`, 'client', 'info');
    
    setTimeout(() => {
      addLog(`[JWT Validate] Checking signature with Server SecretKey...`, 'server', 'info');
      
      setTimeout(() => {
        addLog(`[Success] Signature verified! Payload: sub=user@example.com`, 'server', 'success');
        addLog('HTTP 200 OK - { "data": "Secret Stateless Data" }', 'server', 'info');
      }, 600);
    }, 600);
  };

  const handleLogout = () => {
    addLog(`[Browser] User clicked logout. Deleting JWT from LocalStorage.`, 'client', 'info');
    setJwt(null);
    setTimeout(() => {
      addLog(`[Client] JWT removed. No server interaction needed.`, 'client', 'success');
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ color: 'var(--text-secondary)' }}>
        Stateless authentication uses JWTs (JSON Web Tokens). The server does not store session state. 
        Instead, it cryptographically signs the token. The client sends it via the Authorization header.
      </p>

      {!jwt ? (
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '1rem' }}>Login (Get Token)</h4>
          <input className="input-field" value={username} onChange={e => setUsername(e.target.value)} style={{ marginBottom: '0.5rem' }} />
          <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: '1rem' }} />
          <button className="btn" onClick={handleLogin}>Submit Login</button>
        </div>
      ) : (
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)', padding: '1.5rem', borderRadius: '8px' }}>
          <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Authenticated (Token Stored)</h4>
          <p style={{ fontSize: '0.75rem', marginBottom: '1rem', wordBreak: 'break-all', opacity: 0.8 }}>
            <strong>JWT:</strong> {jwt}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" onClick={handleFetchProtected}>Fetch Protected Resource</button>
            <button className="btn" style={{ background: 'var(--error)' }} onClick={handleLogout}>Clear Token (Logout)</button>
          </div>
        </div>
      )}
    </div>
  );
}
