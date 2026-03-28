import { useState, useEffect } from 'react';
import { Workbox } from 'workbox-window';

export function PWAUpdater() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [wb, setWb] = useState<Workbox | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const workbox = new Workbox('./sw.js');
      setWb(workbox);

      workbox.addEventListener('waiting', () => {
        setShowUpdate(true);
      });

      workbox.register().catch(error => {
        console.error('ServiceWorker registration failed: ', error);
      });
    }
  }, []);

  const handleUpdate = () => {
    if (wb) {
      wb.addEventListener('controlling', () => {
        window.location.reload();
      });
      wb.messageSkipWaiting();
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>Update Available!</h3>
        <p style={styles.text}>A new version of the app is available. Please reload to apply the updates.</p>
        <div style={styles.buttons}>
          <button style={{ ...styles.button, ...styles.buttonDismiss }} onClick={handleDismiss}>
            Dismiss
          </button>
          <button style={{ ...styles.button, ...styles.buttonReload }} onClick={handleUpdate}>
            Reload
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    zIndex: 9999,
  },
  card: {
    background: 'rgba(25, 30, 50, 0.9)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    maxWidth: '320px',
    color: '#fff',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '1.2rem',
    fontFamily: '"Outfit", sans-serif',
    color: '#6366f1',
  },
  text: {
    margin: '0 0 20px 0',
    fontSize: '0.9rem',
    color: '#94a3b8',
    lineHeight: '1.4',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  button: {
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600' as const,
    transition: 'all 0.3s ease',
  },
  buttonDismiss: {
    background: 'transparent',
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  buttonReload: {
    background: '#6366f1',
    color: '#fff',
  },
};
