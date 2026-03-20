import { useState } from 'react';

export default function OAuthDemo({ addLog }: { addLog: (msg: string, source: 'client' | 'server', type?: 'success' | 'error' | 'info') => void }) {
  const [step, setStep] = useState(0);
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const startOAuthFlow = () => {
    addLog(`[Client] Redirecting Browser to Auth Server (Google/GitHub)`, 'client', 'info');
    addLog(`GET https://auth-server.com/authorize?response_type=code&client_id=MY_APP&redirect_uri=MY_APP/cb`, 'client', 'info');
    setStep(1);

    setTimeout(() => {
      addLog(`[Auth Server] Asking User: "Do you allow MY_APP to access your profile?"`, 'server', 'info');
    }, 1000);
  };

  const simulateUserConsent = () => {
    addLog(`[Auth Server] User clicked "Allow". Generating Authorization Code.`, 'server', 'success');

    setTimeout(() => {
      const code = "auth_code_" + Math.random().toString(36).substring(2, 8);
      addLog(`[Auth Server] Redirecting back to Client: HTTP 302 Location: MY_APP/cb?code=${code}`, 'server', 'info');

      setTimeout(() => {
        addLog(`[Browser] Landed on /cb. Extracting code from URL: ${code}`, 'client', 'success');
        setAuthCode(code);
        setStep(2);
      }, 800);
    }, 600);
  };

  const simulateUserDeny = () => {
    addLog(`[Auth Server] User clicked "Deny".`, 'server', 'error');

    setTimeout(() => {
      addLog(`[Auth Server] Redirecting back to Client: HTTP 302 Location: MY_APP/cb?error=access_denied`, 'server', 'error');

      setTimeout(() => {
        addLog(`[Browser] Landed on /cb. Access denied by user.`, 'client', 'error');
        resetFlow();
      }, 800);
    }, 600);
  };

  const exchangeCodeForToken = () => {
    addLog(`POST https://auth-server.com/token\nBody: grant_type=authorization_code&code=${authCode}&client_secret=MY_SECRET`, 'client', 'info');

    setTimeout(() => {
      addLog(`[Auth Server] Validating code & secret...`, 'server', 'info');

      setTimeout(() => {
        const token = "access_token_" + Math.random().toString(36).substring(2, 10);
        addLog(`[Auth Server] Code valid! HTTP 200 OK - { "access_token": "${token}" }`, 'server', 'success');
        setAccessToken(token);
        setStep(3);
      }, 600);
    }, 600);
  };

  const fetchWithOAuthToken = () => {
    addLog(`GET /user-profile\nAuthorization: Bearer ${accessToken}`, 'client', 'info');
    setTimeout(() => {
      addLog(`[Resource Server] Validating OAuth Access Token...`, 'server', 'info');
      setTimeout(() => {
        addLog(`[Resource Server] Token Valid. HTTP 200 OK - { "profile": "User Name" }`, 'server', 'success');
      }, 600);
    }, 600);
  };

  const resetFlow = () => {
    setStep(0);
    setAuthCode(null);
    setAccessToken(null);
    addLog(`---------- OAuth Flow Reset ----------`, 'client', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ color: 'var(--text-secondary)' }}>
        OAuth 2.0 (Authorization Code Flow) delegates authentication to a third party (like Google).
        The client gets a code, securely exchanges it for an access token on the backend, and uses that token.
      </p>

      {step === 0 && (
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <button className="btn" onClick={startOAuthFlow} style={{ background: '#db4437' }}>Login with Mock Server</button>
        </div>
      )}

      {step === 1 && (
        <div style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid var(--secondary)', padding: '1.5rem', borderRadius: '8px' }}>
          <h4 style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>Auth Server Perspective</h4>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>"MY_APP" wants to access your profile.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ background: 'var(--success)' }} onClick={simulateUserConsent}>User Clicks: Allow Access</button>
            <button className="btn" style={{ background: 'var(--error)' }} onClick={simulateUserDeny}>User Clicks: Deny Access</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)', padding: '1.5rem', borderRadius: '8px' }}>
          <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Client Perspective</h4>
          <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
            Browser redirected back with code: <strong>{authCode}</strong>
          </p>
          <button className="btn" onClick={exchangeCodeForToken}>Exchange Code for Token</button>
        </div>
      )}

      {step === 3 && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', padding: '1.5rem', borderRadius: '8px' }}>
          <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Authentication Complete</h4>
          <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
            We have the Access Token: <strong>{accessToken}</strong>
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ background: 'var(--secondary)' }} onClick={fetchWithOAuthToken}>Fetch Profile via API</button>
            <button className="btn" style={{ background: 'var(--error)' }} onClick={resetFlow}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}
