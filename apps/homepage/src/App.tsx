import { appsData } from './apps-data';
import './index.css';

function App() {
  const categories = Array.from(new Set(appsData.map(app => app.category)));

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="portal-container">
      <header className="portal-header">
        <div className="header-glass">
          <h1>Sam's MiniApps</h1>
        </div>
      </header>

      <main className="portal-main">
        {categories.map(category => (
          <section key={category} className="category-section">
            <h2 className="category-title">{category}</h2>
            <div className="apps-grid">
              {appsData
                .filter(app => app.category === category)
                .map(app => (
                  <a
                    href={app.url}
                    key={app.id}
                    className="app-card"
                    onMouseMove={handleMouseMove}
                  >
                    <div className="app-card-image">
                      {app.image ? (
                        <img src={app.image} alt={app.title} />
                      ) : (
                        <div className="placeholder-image">
                          <span>{app.title.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="app-card-content">
                      <h3 className="app-title">{app.title}</h3>
                      <p className="app-desc">{app.description}</p>
                    </div>
                    <div className="app-card-footer">
                      <span className="launch-text">Launch App &rarr;</span>
                    </div>
                  </a>
                ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="portal-footer">
        <p>Built with ❤️ by AI Studio</p>
      </footer>
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  );
}

export default App;

