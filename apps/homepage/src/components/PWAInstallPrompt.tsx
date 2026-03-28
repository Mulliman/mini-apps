import { useState, useEffect } from 'react';

// Extend the window interface to include the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);

    // Check if it's already installed
    // Note: The standalone check works on iOS.
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         // @ts-expect-error - Apple specific
                         window.navigator.standalone;

    // We check if the user has previously dismissed or installed
    const hasPrompted = localStorage.getItem('pwa-prompted');

    if (!isStandalone && !hasPrompted) {
      if (isIosDevice) {
        setIsIOS(true);
        // Add a slight delay so it doesn't pop up instantly on first load
        setTimeout(() => setShowPrompt(true), 2000);
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e as BeforeInstallPromptEvent);

      if (!hasPrompted && !isStandalone) {
        setTimeout(() => setShowPrompt(true), 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    // Show the install prompt
    await installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    setInstallPrompt(null);
    setShowPrompt(false);
    localStorage.setItem('pwa-prompted', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompted', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <img src="./vite.svg" alt="App Icon" style={styles.icon} />
          <h3 style={styles.title}>Install MiniApps</h3>
        </div>

        {isIOS ? (
          <p style={styles.text}>
            Install this app on your iPhone! Tap the <b>Share</b> button and then <b>Add to Home Screen</b>.
          </p>
        ) : (
          <p style={styles.text}>
            Install MiniApps to your device for a better, fullscreen experience and offline access!
          </p>
        )}

        <div style={styles.buttons}>
          <button style={{ ...styles.button, ...styles.buttonDismiss }} onClick={handleDismiss}>
            Not Now
          </button>
          {!isIOS && (
            <button style={{ ...styles.button, ...styles.buttonInstall }} onClick={handleInstall}>
              Install
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed' as const,
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    width: 'calc(100% - 40px)',
    maxWidth: '400px',
  },
  card: {
    background: 'rgba(25, 30, 50, 0.95)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
    color: '#fff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  icon: {
    width: '32px',
    height: '32px',
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    fontFamily: '"Outfit", sans-serif',
    color: '#fff',
  },
  text: {
    margin: '0 0 24px 0',
    fontSize: '0.95rem',
    color: '#94a3b8',
    lineHeight: '1.5',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  button: {
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600' as const,
    transition: 'all 0.3s ease',
  },
  buttonDismiss: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
  },
  buttonInstall: {
    background: '#ec4899', // Using secondary color
    color: '#fff',
    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
  },
};
