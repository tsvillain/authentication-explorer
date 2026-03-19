import { useEffect, useRef } from 'react';

export type LogEntry = {
  id: string;
  time: string;
  source: 'client' | 'server';
  message: string;
  type?: 'success' | 'error' | 'info';
};

export default function LogViewer({ logs }: { logs: LogEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={containerRef}
      className="glass-panel pane-content"
      style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.4)', padding: '1rem', overflowY: 'auto' }}
    >
      {logs.length === 0 && (
        <div style={{ color: 'var(--success)', opacity: 0.8 }}>[System] Waiting for interactions...</div>
      )}

      {logs.map((log) => {
        let color = '#f8fafc';
        if (log.type === 'success') color = 'var(--success)';
        if (log.type === 'error') color = 'var(--error)';
        if (log.type === 'info') color = '#38bdf8'; // light blue

        return (
          <div key={log.id} style={{
            marginBottom: '0.75rem',
            padding: '0.5rem',
            background: log.source === 'server' ? 'rgba(236, 72, 153, 0.05)' : 'rgba(99, 102, 241, 0.05)',
            borderLeft: `3px solid ${log.source === 'server' ? 'var(--secondary)' : 'var(--primary)'}`,
            borderRadius: '0 4px 4px 0',
            animation: 'fadeIn 0.3s ease-in-out'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>{log.source === 'client' ? '🌐 Browser/Client' : '🖥️ Server'}</span>
              <span>{log.time}</span>
            </div>
            <div style={{ color, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {log.message}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
